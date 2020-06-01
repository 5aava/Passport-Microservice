import Discord from 'discord.js';
import server from '../../src/config/config.server';


export const sendhook = message => {
  const hook = new Discord.WebhookClient(
    server.discord.WebHookId,
    server.discord.WebHookToken,
  );

  hook.send(message);
};
