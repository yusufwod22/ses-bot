const { Client, Collection, VoiceChannel } = require('discord.js')
const client = new Client()
const Discord = require("discord.js")
const ytdl = require('ytdl-core')
const settings = './config.yaml'
const fs = require('fs')
const YAML = require("yawn-yaml/cjs")
const { load } = require("js-yaml")
const db = require('megadb')
const voiceState = new db.crearDB('VoiceState');

let config = new YAML(fs.readFileSync("./config.yaml").toString()).json

console.log(config.server)

client.login(config.bot.token).then(() => console.log(`[${client.user.tag}] Başarıyla Giriş yaptım!`)).catch(() => console.error(`Yanlış Bir Token Girdiniz.`))

client.on("ready", () => {
      client.user.setPresence({ activity: { name: `Pirates ❤️` , type: "PLAYING"}, status: 'idle' })
    let vc = client.channels.cache.get(config.server.voiceChannel)
    if (!vc) throw console.error("Config.yaml da voiceChannel için bir ses kanal idi girmelisiniz.")
    if (!vc instanceof VoiceChannel) throw new TypeError("Belirttiğiniz kanal bir ses kanalı değil")
          vc.join().then(() => console.log(`Ses kanalına başarıyla bağlandım`)).catch(() => console.error(`Ses kanalına bağlanırken bir sorun oluştu!`))
})

client.on("voiceStateUpdate", async(oldState, newState) => {
  if (!oldState.channelID && newState.channelID && newState.member.id != client.user.id) {
      let staffs = newState.guild.roles.cache.get(config.server.register).members.map(x => x.id) // YETKİLİ ROL
      if(newState.channelID === config.server.voiceChannel) {
        let vc = await newState.channel.join()
      if (newState.channel.members.some(r => !staffs.includes(newState.member.id)) && newState.channel.members.some(r => !r.hasPermission('ADMINISTRATOR'))) { //Yetkili yok hoşgeldin oynatma
              //https://dm0qx8t0i9gc9.cloudfront.net/previews/audio/BsTwCwBHBjzwub4i4/jg-032316-sfx-elearning-phrases-welcome--female_NWM.mp3

          let taglıAlım = await voiceState.get(`taglıAlım.${newState.guild.id}`)
          if (taglıAlım) {
            return vc.play(config.server.tagliAlim)
          } else if(!taglıAlım) {
            return vc.play(config.server.toplantı)
          }
      } else {
        return vc.play(config.server.yetkiliGiris)
      }
    }
  }
})

