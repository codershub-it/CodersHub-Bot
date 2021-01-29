# Contribuire

Grazie per essere disposto a contribuire al progetto!

# Richiesto:

- Nodejs > 12.x
- MongoDB

# Todolist e come inserire nuove idee

- La Todolist si trova nella [seguente pagina](https://github.com/codershub-it/CodersHub-Bot/projects/1) 
- Per creare una nuova idea o vuoi proporre delle novità aggiungi una issues [nella seguente pagina](https://github.com/codershub-it/CodersHub-Bot/issues).
- Vuoi lavorare su una issues della todolist scrivilo nella issues dedicata.

# Configurazione:

- Effettua il Fork del progetto e clona la repo branches main
- Vai sul sito https://discord.com/developers/applications
- Crea una nuova applicazione, salvando il client_id dal tab "General Information"
- Dal tab "Bot" crea un nuovo bot e salva il token generato
- Crea un server di test su discord di tua proprietà
- Nel server appena creato aggiungi il bot usando questo link con il riferimento client_id: https://discord.com/oauth2/authorize?client_id=inserisci-qui-il-client-id&scope=bot&permissions=66321471
- Crea il file .env usando come base di partenza .env-demo
- Avvia il comando npm install per installare le dipendenze
- Avvia il comando npm start per eseguire il bot

# Commit e Push del codice

Dopo che hai scritto il tuo codice prima di effettuare il pus o commit usa il comando npm run fix per standardizzare il tuo lavoro.
Stai lavorando alla tua prima richiesta pull?
[Come contribuire a un progetto open source su GitHub.](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
Grazie a @kentcdodds per questo fantastico tutorial.
