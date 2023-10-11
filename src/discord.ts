import { Controller, db, DiscordChannel } from "./db";

import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from "discord.js";
import { concat } from "lodash";

export async function reportControllerDifferences(differences: any, discordClient: Client) {
  // Iterate through each configured channel and filter the differences down to match the filtering criteria.
  // This is probably not the best way to do this and I'll figure out a better way later.
  const channels = await db<DiscordChannel>("discord_channels").select("*");

  for (const channel of channels) {
    const discordChannel = await discordClient.channels.cache.get(channel.id) as TextChannel;
    if (!discordChannel) {
      break;
    }
    const signOns = differences.added.filter((controller: Controller) => {
      return channel.config.filters.some((filter) => {
        /* @ts-ignore */
        return controller[filter.property] === filter.value;
      });
    });

    const signOffs = differences.removed.filter((controller: Controller) => {
      return channel.config.filters.some((filter) => {
        /* @ts-ignore */
        return controller[filter.property] === filter.value;
      });
    });

    const embeds = concat(signOffs.map((controller: Controller) => {
      return buildControllerEmbed("off", controller);
    }), signOns.map((controller: Controller) => {
      return buildControllerEmbed("on", controller);
    }));

    if (embeds.length > 0) {
      await sendEmbeds(embeds, discordChannel);
    }
  }
}

function buildControllerEmbed(action: "on" | "off", controller: Controller) {
  const color = action === "on" ? "#00FF00" : "#FF0000";
  const embed = (new EmbedBuilder())
    .setColor(color)
    .setTitle(`${controller.callsign} ${action === "on" ? "is now Online" : "has gone Offline"}`)
    .addFields([
        {
          name: "Name",
          value: controller.name,
          inline: true
        },
        {
          name: "Frequency",
          value: controller.frequency,
          inline: true
        },
        {
          name: "ATIS Text",
          value: `\`\`\`${controller.text_atis ? controller.text_atis.join("\n") : "No ATIS"}\`\`\``
        }
      ]
    )
    .setFooter({ text: `VATSIM ATC Notifications • ${controller.batch} • Last Updated: ${controller.last_updated}`})
  ;

  return embed;
}

export async function sendEmbeds(embeds: EmbedBuilder[], channel: TextChannel) {
  await channel.send({ embeds });
}