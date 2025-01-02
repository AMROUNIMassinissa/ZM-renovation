from flask import Flask, request, jsonify, send_file, Blueprint
import aspose.words as aw
import os
from datetime import datetime

app = Flask(__name__)
facture_bp = Blueprint("fature", __name__)

@facture_bp.route("/generate-invoice", methods=["POST"])
def generate_invoice():
    try:
        # Récupérer les données de la requête
        data = request.json

        # Informations générales
        invoice_number = data.get("invoice_number", "00001")
        date = datetime.now().strftime("%d/%m/%Y")

        # Informations de l'émetteur et du client
        issuer_info = data.get("issuer", {})
        client_info = data.get("client", {})
        articles = data.get("articles", [])
        print(articles)

        # Calculs des totaux
        total_ht = sum(article['quantity'] * article['unit_price'] for article in articles)
        total_tva = sum((article['quantity'] * article['unit_price']) * (20 / 100) for article in articles)
        total_ttc = total_ht + total_tva

        # Créer un nouveau document Word
        doc = aw.Document()
        builder = aw.DocumentBuilder(doc)

        # Ajouter les informations générales
        builder.writeln(f"Facture N°: {invoice_number}")
        builder.writeln(f"Date: {date}")
        builder.writeln("")
        builder.writeln("Émetteur :")
        builder.writeln(f"Nom : {issuer_info.get('name', '')}")
        builder.writeln(f"Adresse : {issuer_info.get('address', '')}")
        builder.writeln(f"Téléphone : {issuer_info.get('phone', '')}")
        builder.writeln("")
        builder.writeln("Client :")
        builder.writeln(f"Nom : {client_info.get('name', '')}")
        builder.writeln(f"Adresse : {client_info.get('address', '')}")
        builder.writeln(f"Téléphone : {client_info.get('phone', '')}")
        builder.writeln("")
        
        # Ajouter une table pour les articles
        builder.start_table()

        # Ajouter l'en-tête
        builder.insert_cell()
        builder.write("Description")
        builder.insert_cell()
        builder.write("Quantité")
        builder.insert_cell()
        builder.write("Prix Unitaire")
        builder.insert_cell()
        builder.write("TVA (%)")
        builder.insert_cell()
        builder.write("Montant TVA")
        builder.insert_cell()
        builder.write("Total TTC")
        builder.end_row()

        # Ajouter les articles dynamiquement
        for article in articles:
            builder.insert_cell()
            builder.write(article['description'])
            builder.insert_cell()
            builder.write(str(article['quantity']))
            builder.insert_cell()
            builder.write(f"{article['unit_price']:.2f} €")
            builder.insert_cell()
            builder.write(f"20 %")
            builder.insert_cell()
            tva_amount = article['quantity'] * article['unit_price'] * 20 / 100
            builder.write(f"{tva_amount:.2f} €")
            builder.insert_cell()
            total_ttc = article['quantity'] * article['unit_price'] * (1 + 20 / 100)
            builder.write(f"{total_ttc:.2f} €")
            builder.end_row()

        # Terminer la table
        builder.end_table()

        # Ajouter les totaux
        builder.writeln("")
        builder.writeln(f"Total HT: {total_ht:.2f} €")
        builder.writeln(f"Total TVA: {total_tva:.2f} €")
        builder.writeln(f"Total TTC: {total_ttc:.2f} €")

        # Enregistrer le document
        output_path = f"invoice_{invoice_number}.docx"
        doc.save(output_path)

        # Envoyer le fichier généré au frontend
        return send_file(output_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
