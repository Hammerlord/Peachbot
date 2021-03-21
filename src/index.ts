const Discord = require("discord.js");
import { TOKEN } from "../token.json";
import { updateEntitiesProductivity } from "./stock/productivity";

const client = new Discord.Client();
const PREFIX = ";p";

client.login(TOKEN);

client.on("message", async (message: any) => {
    if (!message.content.startsWith(PREFIX)) {
        return await updateEntitiesProductivity(message);
    }

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args.slice(1, args.length));
    } catch (error) {
        console.error(error);
    }
});
