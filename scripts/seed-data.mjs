import { drizzle } from "drizzle-orm/mysql2";
import { questionPacks, questions, miniChallenges } from "../drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding database...");

  // Insert free pack
  await db.insert(questionPacks).values({
    packId: "para-romper-el-hielo",
    name: "Para Romper el Hielo",
    description: "Preguntas divertidas y seguras para cualquier grupo",
    mode: "both",
    price: 0,
    stripePriceId: null,
    isActive: 1,
  });

  console.log("✅ Pack 'Para Romper el Hielo' created");

  // Insert questions for Familiar mode
  const familiarQuestions = [
    "¿Cuál es la comida más rara que has probado en tu vida?",
    "¿Cuál era tu juguete favorito de niño?",
    "¿Qué superpoder te gustaría tener y por qué?",
    "¿Cuál ha sido tu viaje más memorable?",
    "¿Qué animal serías y por qué?",
    "¿Cuál es el mejor regalo que has recibido?",
    "¿Qué harías si ganaras la lotería?",
    "¿Cuál es tu película favorita de todos los tiempos?",
    "¿Qué talento secreto tienes?",
    "¿Cuál ha sido tu momento más vergonzoso en público?",
    "¿Qué te daba más miedo cuando eras pequeño?",
    "¿Cuál es tu recuerdo favorito de la infancia?",
    "¿Qué profesión te hubiera gustado tener?",
    "¿Cuál es la cosa más loca que has hecho?",
    "¿Qué personaje de ficción te gustaría ser?",
    "¿Cuál es tu comida favorita?",
    "¿Qué lugar del mundo te gustaría visitar?",
    "¿Cuál ha sido tu mejor cumpleaños?",
    "¿Qué te hace reír sin falta?",
    "¿Cuál es tu canción favorita?",
    "¿Qué hobby te gustaría aprender?",
    "¿Cuál es tu estación del año favorita?",
    "¿Qué te gustaría hacer en tus próximas vacaciones?",
    "¿Cuál es el mejor consejo que te han dado?",
    "¿Qué te hace sentir más feliz?",
    "¿Cuál es tu deporte favorito?",
    "¿Qué libro te ha marcado más?",
    "¿Cuál es tu color favorito y por qué?",
    "¿Qué te gustaría ser de mayor cuando eras niño?",
    "¿Cuál ha sido tu día más feliz?",
    "¿Qué tradición familiar te gusta más?",
    "¿Cuál es tu postre favorito?",
    "¿Qué te gustaría aprender a cocinar?",
    "¿Cuál es tu juego de mesa favorito?",
    "¿Qué mascota te gustaría tener?",
    "¿Cuál es tu serie de TV favorita?",
    "¿Qué te gustaría hacer este fin de semana?",
    "¿Cuál es tu helado favorito?",
    "¿Qué música escuchas cuando estás feliz?",
    "¿Cuál es tu actividad favorita para hacer en familia?",
  ];

  const familiarQuestionsData = familiarQuestions.map((q) => ({
    packId: "para-romper-el-hielo",
    questionText: q,
    mode: "familiar",
  }));

  await db.insert(questions).values(familiarQuestionsData);
  console.log(`✅ ${familiarQuestions.length} Familiar questions created`);

  // Insert questions for Adultos mode
  const adultosQuestions = [
    "¿Cuál ha sido tu peor cita?",
    "¿Alguna vez has fingido que te gustaba un regalo que odiabas?",
    "¿Cuál es la mentira más grande que has dicho?",
    "¿Qué es lo más vergonzoso que has hecho estando borracho?",
    "¿Alguna vez has espiado a alguien en redes sociales durante horas?",
    "¿Cuál es tu mayor arrepentimiento?",
    "¿Alguna vez has salido con dos personas a la vez?",
    "¿Qué es lo más atrevido que has hecho?",
    "¿Alguna vez has mentido en tu currículum?",
    "¿Cuál es tu fantasía más loca?",
    "¿Alguna vez has fingido estar enfermo para no ir a trabajar?",
    "¿Qué es lo más caro que has roto sin querer?",
    "¿Alguna vez has leído los mensajes de otra persona sin permiso?",
    "¿Cuál es tu mayor secreto?",
    "¿Alguna vez has hecho trampa en un examen?",
    "¿Qué es lo más raro que has buscado en internet?",
    "¿Alguna vez has fingido conocer a alguien famoso?",
    "¿Cuál es la cosa más vergonzosa en tu historial de búsqueda?",
    "¿Alguna vez has robado algo?",
    "¿Qué es lo más estúpido por lo que has gastado dinero?",
    "¿Alguna vez has tenido un crush con alguien inapropiado?",
    "¿Cuál es tu hábito más asqueroso?",
    "¿Alguna vez has fingido estar de acuerdo con alguien solo para evitar conflicto?",
    "¿Qué es lo más embarazoso que tus padres te han pillado haciendo?",
    "¿Alguna vez has stalkeado a tu ex en redes sociales?",
    "¿Cuál es tu miedo más irracional?",
    "¿Alguna vez has mentido sobre tu edad?",
    "¿Qué es lo más raro que has comido por una apuesta?",
    "¿Alguna vez has fingido que no viste un mensaje?",
    "¿Cuál es la peor decisión que has tomado?",
    "¿Alguna vez has ghosteado a alguien?",
    "¿Qué es lo más vergonzoso que hay en tu teléfono?",
    "¿Alguna vez has llorado viendo una película infantil?",
    "¿Cuál es tu guilty pleasure?",
    "¿Alguna vez has fingido saber de un tema del que no tenías ni idea?",
    "¿Qué es lo más ridículo que has hecho por amor?",
    "¿Alguna vez has mentido sobre tus planes para evitar quedar con alguien?",
    "¿Cuál es tu mayor inseguridad?",
    "¿Alguna vez has tenido un sueño erótico con alguien que conoces?",
    "¿Qué es lo más vergonzoso que has hecho para llamar la atención de alguien?",
  ];

  const adultosQuestionsData = adultosQuestions.map((q) => ({
    packId: "para-romper-el-hielo",
    questionText: q,
    mode: "adultos",
  }));

  await db.insert(questions).values(adultosQuestionsData);
  console.log(`✅ ${adultosQuestions.length} Adultos questions created`);

  // Insert mini challenges for Familiar mode
  const familiarChallenges = [
    "Imita a tu animal favorito durante 10 segundos",
    "Canta el estribillo de tu canción favorita",
    "Cuenta un chiste (aunque sea malo)",
    "Haz 5 flexiones",
    "Baila durante 15 segundos sin música",
    "Habla como un robot durante 30 segundos",
    "Di 5 palabras que rimen con 'amor'",
    "Haz una mueca graciosa y mantenla 10 segundos",
    "Cuenta una historia inventada en 20 segundos",
    "Imita a alguien del grupo (sin ofender)",
    "Haz el pino (o inténtalo)",
    "Di el abecedario al revés",
    "Actúa como si fueras un bebé durante 20 segundos",
    "Haz un trabalenguas 3 veces seguidas",
    "Cuenta hasta 20 en otro idioma",
    "Haz una reverencia exagerada a todos",
    "Camina como un cangrejo por la habitación",
    "Di 'supercalifragilisticoespialidoso' 3 veces rápido",
    "Haz una estatua y mantente inmóvil 30 segundos",
    "Imita a tu profesor favorito",
  ];

  const familiarChallengesData = familiarChallenges.map((c) => ({
    challengeText: c,
    mode: "familiar",
  }));

  await db.insert(miniChallenges).values(familiarChallengesData);
  console.log(`✅ ${familiarChallenges.length} Familiar challenges created`);

  // Insert mini challenges for Adultos mode
  const adultosChallenges = [
    "Cuenta tu peor cita en 30 segundos",
    "Revela tu último mensaje enviado",
    "Muestra tu foto más vergonzosa",
    "Confiesa tu crush secreto del grupo",
    "Bebe un shot de lo que elijan los demás",
    "Envía un mensaje a tu ex diciendo 'hola'",
    "Deja que alguien escriba lo que quiera en tu estado",
    "Cuenta tu mayor vergüenza",
    "Haz una llamada y habla solo con rimas",
    "Muestra tu historial de búsqueda reciente",
    "Deja que alguien vea tus fotos del móvil durante 1 minuto",
    "Confiesa algo que nadie del grupo sepa",
    "Imita a alguien del grupo de forma exagerada",
    "Cuenta la mentira más grande que has dicho",
    "Deja que alguien publique algo en tu red social",
    "Revela tu mayor miedo",
    "Cuenta algo embarazoso de tu adolescencia",
    "Haz una confesión sobre alguien del grupo",
    "Muestra tu conversación más cringe",
    "Cuenta por qué terminó tu última relación",
  ];

  const adultosChallengesData = adultosChallenges.map((c) => ({
    challengeText: c,
    mode: "adultos",
  }));

  await db.insert(miniChallenges).values(adultosChallengesData);
  console.log(`✅ ${adultosChallenges.length} Adultos challenges created`);

  // Insert premium packs (without questions for now)
  const premiumPacks = [
    {
      packId: "salseo-total",
      name: "Salseo Total",
      description: "Preguntas atrevidas para grupos con mucha confianza",
      mode: "adultos",
      price: 299, // $2.99
      stripePriceId: null, // Will be set when Stripe is configured
      isActive: 1,
    },
    {
      packId: "dilemas-morales",
      name: "Dilemas Morales",
      description: "Escenarios hipotéticos que exploran tu forma de pensar",
      mode: "both",
      price: 299,
      stripePriceId: null,
      isActive: 1,
    },
    {
      packId: "recuerdos-infancia",
      name: "Recuerdos de la Infancia",
      description: "Anécdotas y vivencias de cuando erais niños",
      mode: "familiar",
      price: 299,
      stripePriceId: null,
      isActive: 1,
    },
    {
      packId: "historias-viaje",
      name: "Historias de Viaje",
      description: "Aventuras, desastres y descubrimientos en tus viajes",
      mode: "both",
      price: 299,
      stripePriceId: null,
      isActive: 1,
    },
  ];

  await db.insert(questionPacks).values(premiumPacks);
  console.log(`✅ ${premiumPacks.length} Premium packs created`);

  console.log("🎉 Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
