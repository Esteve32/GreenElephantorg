import { escapeEmailHtml } from './scan-results-email';
export function scanServiceEmail(kind:'purchase'|'reminder',name:string|null,language:'en'|'fr'='en') {
 const fr=language==='fr', reminder=kind==='reminder';
 const subject=fr?(reminder?'Votre Satellite Scan vous attend':'Votre Satellite Scan est confirmé'):(reminder?'Your Satellite Scan is waiting':'Your Satellite Scan is confirmed');
 const greeting=fr?'Bonjour':'Hello';
 const intro=fr?(reminder?'Vous pouvez reprendre votre questionnaire quand vous êtes prêt·e.':'Merci pour votre achat. Votre Satellite Scan vous aide à mieux comprendre votre façon de communiquer et à donner à l’IA des consignes qui vous ressemblent.'):(reminder?'You can return to your questionnaire when you are ready.':'Thank you for your purchase. Your Satellite Scan helps you understand how you communicate and give AI instructions that sound like you.');
 const detail=fr?'Prévoyez environ 90 minutes au calme. Après votre réponse, un coach prépare votre tableau de bord sous 48 à 72 heures. Vous recevrez un autre e-mail quand il sera prêt.':'Allow about 90 quiet minutes. After you submit your answers, a coach prepares your dashboard within 48–72 hours. You will receive another email when it is ready.';
 const label=fr?'Ouvrir mon Satellite Scan':'Open my Satellite Scan';
 const url='https://greenelephantorg.typeform.com/individualscan#language='+language;
 const resource='https://www.greenelephant.org/resources';
 const end=fr?'Une question ? Répondez à cet e-mail pour joindre Esteve.':'Questions? Reply to this email to reach Esteve.';
 const footer=fr?'Ce message concerne votre achat. Il ne vous inscrit pas à une newsletter.':'This message concerns your purchase. It does not subscribe you to a newsletter.';
 const text=[greeting+' '+(name||''),intro,detail,label+': '+url,(fr?'Ressources (en anglais)':'Resources')+': '+resource,end,footer].join('\n\n');
 const html='<div lang="'+language+'" style="background:#070d18;color:#e6e7eb;padding:28px;font-family:Arial,sans-serif;line-height:1.7"><h1 style="color:#b99edc">'+subject+'</h1><p>'+escapeEmailHtml(greeting+' '+(name||''))+'</p><p>'+intro+'</p><p>'+detail+'</p><p><a style="color:#61cccc" href="'+url+'">'+label+'</a></p><p><a style="color:#61cccc" href="'+resource+'">'+(fr?'Ressources de communication (en anglais)':'Communication resources')+'</a></p><p>'+end+'</p><p style="font-size:12px">'+footer+'</p></div>';
 return {subject,html,text};
}
