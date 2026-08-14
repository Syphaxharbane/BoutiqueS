# Boutique Algérie — V1

## Installation

1. Crée un projet gratuit sur Supabase.
2. Dans Supabase > SQL Editor, colle `schema.sql` et exécute-le.
3. Dans Authentication, crée ton compte administrateur avec ton email et ton mot de passe.
4. Dans Storage, crée un bucket public nommé `product-images`.
5. Ouvre `js/config.js` et remplace :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Héberge le dossier sur GitHub Pages.

## Utilisation

- `index.html` : boutique.
- `cart.html` : panier.
- `checkout.html` : commande.
- `admin/index.html` : connexion admin.
- `admin/products.html` : ajouter/modifier/supprimer les produits.
- `admin/orders.html` : gérer les commandes.

## Important

Cette V1 utilise Supabase Auth pour protéger l'administration et RLS pour protéger les données.
Pour une boutique publique, ne mets JAMAIS une clé `service_role` dans le JavaScript du navigateur.

Les frais de livraison sont actuellement un exemple uniforme de 500 DA pour chaque wilaya.
Tu peux les modifier facilement dans `js/shop.js` ou, dans une V2, les mettre dans une table `shipping_rates`.
