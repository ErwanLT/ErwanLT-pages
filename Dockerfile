# Utiliser l'image officielle Jekyll comme base
FROM jekyll/jekyll:4

# Définir le répertoire de travail dans le conteneur
WORKDIR /srv/jekyll

# Installer la gem webrick
RUN gem install webrick

# Copier tout le contenu du dossier docs dans le conteneur
COPY docs/ .

# Exposer le port 4000 pour le serveur Jekyll
EXPOSE 4000

# Commande pour lancer le serveur Jekyll
CMD ["jekyll", "serve", "--watch", "--host", "0.0.0.0", "--destination", "_site"]