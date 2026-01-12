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

  // Insert questions for Familiar mode (IMPROVED VERSION)
  const familiarQuestions = [
    "Ayer me encontré con mi expareja en el supermercado y nos tomamos un café juntos",
    "Mi hermano me pidió dinero prestado y nunca me lo devolvió, pero fingimos que no pasó nada",
    "Hace poco descubrí que mi mejor amigo habla mal de mí a sus otras amistades",
    "Me comí la comida del refrigerador que mi pareja había guardado para el almuerzo",
    "Una vez fingí estar enfermo para no ir a una reunión familiar importante",
    "Mi jefe me pidió que hiciera algo que va contra mis principios, pero lo hice de todas formas",
    "Volví con mi expareja después de jurar que nunca lo haría",
    "Choqué el auto de mi papá y le eché la culpa a mi hermano",
    "Gasté todo mi dinero de vacaciones en algo impulsivo y tuve que pedir dinero",
    "Mi pareja me preguntó si me gustaba su nueva apariencia y mentí diciendo que sí",
    "Fui a una fiesta donde no conocía a nadie y me pasé toda la noche en el teléfono",
    "Alguien me contó un secreto y no pude evitar contárselo a mi pareja",
    "Dejé de hablar con un amigo porque me enteré que había hablado mal de mí",
    "Compré algo caro sin decirle a mi pareja y lo escondí en el closet",
    "Una vez le dije a alguien que no podía ir a su evento porque estaba ocupado, pero en realidad no quería ir",
    "Mi mamá me pidió que guardara un secreto de mi papá y lo hice",
    "Pretendí entender algo en una conversación pero en realidad no tenía idea",
    "Me arrepiento de algo que hice hace años pero nunca lo confesé",
    "Una vez tuve que elegir entre un amigo y mi pareja, y elegí a mi pareja",
    "Fingí que me gustó un regalo que me dieron pero lo odié",
  ];

  const familiarQuestionsData = familiarQuestions.map((q) => ({
    packId: "para-romper-el-hielo",
    questionText: q,
    mode: "familiar",
  }));

  await db.insert(questions).values(familiarQuestionsData);
  console.log(`✅ ${familiarQuestions.length} Familiar questions created`);

  // Insert questions for Adultos mode (IMPROVED VERSION)
  const adultosQuestions = [
    "Salí con alguien mientras aún estaba en una relación",
    "Mi pareja me preguntó cuántas parejas había tenido y mentí sobre el número",
    "Robé algo pequeño de una tienda y nunca lo confesé",
    "Hablé mal de mi jefe en una reunión de trabajo y casi me atrapa",
    "Tuve una aventura de una noche que mi pareja no sabe",
    "Mentí sobre mis ingresos cuando empecé a salir con mi pareja",
    "Fui a una fiesta donde sabía que estaría mi expareja y me comporté de forma que no me reconociera",
    "Acepté un trabajo sabiendo que le haría daño a un amigo que trabajaba en la competencia",
    "Usé información confidencial de mi trabajo para beneficio personal",
    "Tuve que elegir entre un viaje con mi pareja o una oportunidad de negocio, y elegí el negocio",
    "Fingí que no sabía algo importante para evitar una conversación incómoda",
    "Hice algo en una fiesta que no querría que mi pareja supiera",
    "Mentí en una entrevista de trabajo para conseguir el puesto",
    "Gasté dinero que era para pagar una deuda en algo para mí",
    "Tuve una conversación importante con alguien pero no fui completamente honesto",
    "Hice algo que sabía que lastimería a alguien cercano pero lo hice de todas formas",
    "Fingí estar enfermo para no ir a un compromiso importante",
    "Tomé dinero prestado de alguien y no lo devolví en el tiempo acordado",
    "Tuve que guardar un secreto que me afectaba emocionalmente pero no podía contárselo a nadie",
    "Hice algo que sabía que estaba mal pero lo hice porque todos lo hacían",
  ];

  const adultosQuestionsData = adultosQuestions.map((q) => ({
    packId: "para-romper-el-hielo",
    questionText: q,
    mode: "adultos",
  }));

  await db.insert(questions).values(adultosQuestionsData);
  console.log(`✅ ${adultosQuestions.length} Adultos questions created`);

  // Insert mini challenges for Familiar mode (IMPROVED VERSION)
  const familiarChallenges = [
    "Llama a tu mamá ahora y cuéntale un chisme falso sobre alguien del grupo (sin decirle que es falso)",
    "Haz un baile ridículo durante 30 segundos mientras todos te graban",
    "Canta la canción más vergonzosa que conozcas en voz alta",
    "Imita a cada persona del grupo de forma exagerada (máximo 1 minuto por persona)",
    "Cuéntale a alguien del grupo un secreto vergonzoso (real o inventado)",
    "Haz una llamada a alguien y dile que ganó un premio (sin revelar que es broma)",
    "Escribe un mensaje de amor vergonzoso a alguien del grupo y léelo en voz alta",
    "Pídele a alguien del grupo que te dé un masaje en los pies durante 1 minuto",
    "Haz una imitación de alguien del grupo mientras te miran a los ojos",
    "Cuéntale a alguien una historia completamente falsa como si fuera verdad (máximo 2 minutos)",
    "Dibuja a cada persona del grupo en 30 segundos cada una",
    "Crea una canción sobre alguien del grupo en el momento",
    "Haz una predicción sobre el futuro de alguien del grupo (lo más específico posible)",
    "Escribe un poema vergonzoso sobre ti mismo y léelo en voz alta",
    "Crea un personaje ficticio y cuéntale su historia al grupo",
    "Dibuja algo basado en una palabra que alguien te diga (máximo 1 minuto)",
    "Escribe un titular de periódico sobre alguien del grupo",
    "Crea un comercial falso para un producto ridículo",
    "Haz una lista de las cosas más vergonzosas que has hecho (mínimo 5)",
    "Crea un meme mental sobre alguien del grupo y descríbelo",
    "Confiesa algo que nunca le has dicho a nadie en el grupo",
    "Dile a alguien del grupo algo que siempre quisiste decirle pero nunca te atreviste",
    "Cuéntale al grupo tu mayor miedo",
    "Confiesa algo que te avergüenza de tu pasado",
    "Dile a alguien del grupo por qué es importante para ti",
    "Cuéntale al grupo tu mayor inseguridad",
    "Confiesa algo que has mentido sobre ti mismo",
    "Dile a alguien del grupo algo que siempre quisiste que supiera",
    "Cuéntale al grupo tu mayor arrepentimiento",
    "Confiesa algo que has hecho que nadie sabe",
  ];

  const familiarChallengesData = familiarChallenges.map((c) => ({
    challengeText: c,
    mode: "familiar",
  }));

  await db.insert(miniChallenges).values(familiarChallengesData);
  console.log(`✅ ${familiarChallenges.length} Familiar challenges created`);

  // Insert mini challenges for Adultos mode (IMPROVED VERSION)
  const adultosChallenges = [
    "Llama a un amigo cercano y pídele que te cuente un secreto (sin decirle que es un reto)",
    "Envía un mensaje de texto vergonzoso a alguien importante en tu vida",
    "Haz una confesión de amor falsa a alguien del grupo",
    "Baila de forma sensual durante 30 segundos mientras todos te miran",
    "Canta una canción de amor vergonzosa a alguien del grupo",
    "Haz una imitación de una escena de película de adultos (sin ser gráfico)",
    "Cuéntale a alguien del grupo tu fantasía más vergonzosa (sin detalles explícitos)",
    "Haz una lista de tus tipos ideales y léela en voz alta",
    "Describe a alguien del grupo de forma atractiva sin ser ofensivo",
    "Crea un perfil de citas falso para alguien del grupo (de forma divertida)",
    "Confiesa tu mayor secreto sexual (sin detalles explícitos)",
    "Cuéntale al grupo sobre tu peor experiencia romántica",
    "Confiesa algo que has hecho que te avergüenza en una relación",
    "Dile a alguien del grupo qué te atrae de él/ella (de forma honesta)",
    "Cuéntale al grupo sobre tu mayor fracaso romántico",
    "Confiesa algo que has mentido sobre tu vida sexual",
    "Cuéntale al grupo sobre la persona con la que más te arrepientes haber estado",
    "Dile a alguien del grupo algo que siempre quisiste hacer con él/ella (sin ser gráfico)",
    "Confiesa tu mayor inseguridad en una relación",
    "Cuéntale al grupo sobre tu mayor miedo en una relación",
    "Confiesa algo vergonzoso que has hecho por amor",
    "Dile a alguien del grupo algo que siempre quisiste decirle pero nunca te atreviste",
    "Cuéntale al grupo sobre la vez que más miedo tuviste",
    "Confiesa algo que has hecho que te hace sentir culpable",
    "Dile a alguien del grupo algo que nadie más sabe sobre ti",
    "Cuéntale al grupo tu mayor arrepentimiento en la vida",
    "Confiesa algo que has hecho que cambió quién eres",
    "Cuéntale al grupo sobre una decisión difícil que tuviste que tomar",
    "Cuéntale al grupo sobre la persona que más has admirado",
    "Confiesa algo que has hecho que te avergüenza profundamente",
  ];

  const adultosChallengesData = adultosChallenges.map((c) => ({
    challengeText: c,
    mode: "adultos",
  }));

  await db.insert(miniChallenges).values(adultosChallengesData);
  console.log(`✅ ${adultosChallenges.length} Adultos challenges created`);

  // ========================================
  // Premium Packs Questions (IMPROVED VERSION)
  // ========================================

  // Salseo Total - Adultos Questions
  const salseoTotalQuestions = [
    "He visto a alguien importante en mi círculo haciendo algo que podría arruinar su reputación",
    "Mi pareja tiene una amistad que me pone celoso/a pero nunca lo he confesado",
    "Sé un secreto de alguien que si se enteran otros, cambiaría cómo lo ven",
    "He fingido estar de acuerdo con un amigo en algo que no comparto para no pelear",
    "Alguien me pidió que no contara algo pero se lo conté a mi pareja",
    "He sentido que alguien está celoso de mi éxito pero no lo he mencionado",
    "Tuve una conversación incómoda con alguien importante y desde entonces las cosas están raras",
    "He visto a un amigo siendo infiel y no sé si contar o no",
    "Alguien en mi círculo está en una relación tóxica y todos lo sabemos pero nadie dice nada",
    "He escuchado chismes sobre mí que no son ciertos pero no los he desmentido",
    "Mi mejor amigo está enamorado de alguien que ya tiene pareja",
    "He visto a alguien importante en una situación comprometedora y podría chantajearlo",
    "Alguien me contó algo sobre mi pareja que me hizo dudar de la relación",
    "He fingido estar feliz en mi relación cuando en realidad estoy pensando en terminar",
    "Sé que alguien está mintiendo pero todos le creen, incluyendo la persona afectada",
    "He visto a un colega sabotear el trabajo de otro y nadie más se dio cuenta",
    "Mi pareja tiene una amistad del pasado que me hace sentir inseguro/a",
    "He escuchado a alguien hablar mal de mí pero fingí que no lo escuché",
    "Alguien que me cae mal está teniendo problemas y todos esperan que los ayude",
    "He visto a un amigo hacer algo que va contra sus propios principios",
    "Mi pareja tiene un hábito que me molesta pero he decidido no mencionarlo",
    "He sentido que alguien está intentando reemplazarme en un círculo de amigos",
    "Alguien importante me pidió que eligiera entre ellos y otra persona",
    "He visto a alguien importante siendo cruel con alguien vulnerable",
    "Mi mejor amigo está enamorado de mi pareja y lo sé",
    "He escuchado a alguien confesar algo que cambió cómo los veo",
    "Alguien en mi círculo está gastando dinero que no tiene y todos lo sabemos",
    "He visto a un amigo mentirle a su pareja y me siento incómodo/a",
    "Mi pareja tiene un amigo que claramente está enamorado de él/ella",
    "He fingido que no me importa algo que en realidad me importa mucho",
  ];

  const salseoTotalData = salseoTotalQuestions.map((q) => ({
    packId: "salseo-total",
    questionText: q,
    mode: "adultos",
  }));

  await db.insert(questions).values(salseoTotalData);
  console.log(`✅ Salseo Total: ${salseoTotalQuestions.length} adultos questions`);

  // Dilemas Morales - Both Modes
  const dilemasMoralesQuestions = [
    "¿Mentirías para proteger a alguien que amas?",
    "¿Reportarías a un amigo si comete un crimen menor?",
    "¿Dirías la verdad si saber la verdad lastimará a alguien?",
    "¿Tomarías dinero que encontraste sin dueño aparente?",
    "¿Ayudarías a alguien que sabes que está haciendo algo malo?",
    "¿Dirías que sí a algo que no quieres hacer para complacer a alguien?",
    "¿Usarías información confidencial si beneficiara a alguien que amas?",
    "¿Terminarías una amistad si descubres que tu amigo es una mala persona?",
    "¿Mentirías en un examen si nadie se enteraría?",
    "¿Dirías la verdad si saber la verdad te perjudicaría a ti?",
    "¿Abandonarías tus principios por dinero o estabilidad?",
    "¿Reportarías a un familiar si comete un crimen?",
    "¿Dirías que no a una oportunidad de oro si significa lastimar a alguien?",
    "¿Guardarías un secreto que podría prevenir un daño?",
    "¿Tomarías un trabajo que sabes que es éticamente cuestionable?",
    "¿Dirías la verdad en una situación donde mentir te beneficiaría?",
    "¿Ayudarías a alguien que te ha hecho daño en el pasado?",
    "¿Sacrificarías tu felicidad por la de alguien que amas?",
    "¿Dirías que no a algo que todos quieren que hagas?",
    "¿Usarías un favor que alguien te debe para algo que beneficia solo a ti?",
    "¿Dirías la verdad si sabes que arruinaría una amistad?",
    "¿Tomarías dinero de alguien si sabías que nunca se enteraría?",
    "¿Reportarías a un colega si está cometiendo fraude?",
    "¿Dirías que sí a algo que va contra tus valores?",
    "¿Guardarías un secreto que afecta a alguien más?",
    "¿Mentirías para conseguir algo que realmente quieres?",
    "¿Dirías la verdad si saber la verdad cambiaría cómo alguien te ve?",
    "¿Ayudarías a alguien si significa sacrificar tu tiempo?",
    "¿Dirías que no a una persona importante si no quieres hacer algo?",
    "¿Tomarías una decisión que beneficia a muchos pero perjudica a uno?",
  ];

  const dilemasFamiliarData = dilemasMoralesQuestions.slice(0, 15).map((q) => ({
    packId: "dilemas-morales",
    questionText: q,
    mode: "familiar",
  }));

  const dilemasAdultosData = dilemasMoralesQuestions.map((q) => ({
    packId: "dilemas-morales",
    questionText: q,
    mode: "adultos",
  }));

  await db.insert(questions).values([...dilemasFamiliarData, ...dilemasAdultosData]);
  console.log(`✅ Dilemas Morales: ${dilemasFamiliarData.length} familiar + ${dilemasAdultosData.length} adultos questions`);

  // Recuerdos de la Infancia - Familiar
  const recuerdosInfanciaQuestions = [
    "Recuerdo que cuando era niño/a, mis papás me llevaban a un lugar especial cada fin de semana",
    "Tenía un mejor amigo de la infancia con el que ya no hablo",
    "Hice algo en la escuela que mis papás nunca se enteraron",
    "Recuerdo que me aterraba algo de la infancia que ahora me parece tonto",
    "Tuve un maestro que cambió mi vida de forma positiva",
    "Recuerdo que quería ser algo completamente diferente cuando era niño/a",
    "Tenía un juguete favorito que perdí y nunca lo superé",
    "Recuerdo que mis hermanos y yo hacíamos algo que nuestros papás no sabían",
    "Tuve una mascota que fue muy importante para mí",
    "Recuerdo que me avergonzaba algo de mi familia en la escuela",
    "Tenía un lugar secreto donde me escondía cuando estaba triste",
    "Recuerdo que hice algo que lastimé a alguien en la infancia",
    "Tuve un sueño recurrente que me asustaba",
    "Recuerdo que quería algo desesperadamente pero nunca lo tuve",
    "Tenía una tradición familiar que extraño",
    "Recuerdo que hice algo que me metió en problemas con mis papás",
    "Tuve un amigo imaginario en la infancia",
    "Recuerdo que mis papás me prometieron algo que nunca cumplieron",
    "Tenía un miedo irracional que superé con el tiempo",
    "Recuerdo que me sentía diferente a los otros niños",
    "Tuve una experiencia vergonzosa en la escuela que nunca olvidé",
    "Recuerdo que mis papás me dieron una lección importante",
    "Tenía un lugar favorito en mi casa donde pasaba horas",
    "Recuerdo que quería ser como alguien en particular",
    "Tuve una amistad de infancia que terminó de forma abrupta",
    "Recuerdo que hice algo que me hizo sentir muy orgulloso/a",
    "Tenía un ritual diario que hacía con mi familia",
    "Recuerdo que me enteré de algo que cambió mi inocencia",
    "Tuve un regalo especial que guardé por años",
    "Recuerdo que sentía que no pertenecía en algún lugar",
  ];

  const recuerdosInfanciaData = recuerdosInfanciaQuestions.map((q) => ({
    packId: "recuerdos-infancia",
    questionText: q,
    mode: "familiar",
  }));

  await db.insert(questions).values(recuerdosInfanciaData);
  console.log(`✅ Recuerdos de la Infancia: ${recuerdosInfanciaQuestions.length} familiar questions`);

  // Historias de Viaje - Both Modes
  const historiasViajeQuestions = [
    "Tuve un viaje donde algo salió completamente mal pero terminó siendo la mejor historia",
    "Me perdí en una ciudad extranjera y tuve que improvisar",
    "Conocí a alguien en un viaje que cambió mi perspectiva",
    "Tuve una experiencia en un viaje que nunca le conté a mis papás",
    "Hice algo peligroso en un viaje que no volvería a hacer",
    "Viajé a un lugar donde no hablaba el idioma y pasó algo cómico",
    "Tuve que gastar mucho dinero en un viaje para resolver un problema",
    "Conocí a alguien en un viaje y tuvimos una conexión especial",
    "Tuve una enfermedad o accidente en un viaje en el extranjero",
    "Viajé a un lugar que no era como esperaba",
    "Tuve que volver a casa antes de lo planeado por algo importante",
    "Hice algo en un viaje que me avergüenza recordar",
    "Viajé con alguien y la relación cambió después del viaje",
    "Tuve una experiencia espiritual o transformadora en un viaje",
    "Viajé a un lugar peligroso sin que mis papás lo supieran",
    "Conocí a alguien en un viaje que se convirtió en mi mejor amigo/a",
    "Tuve que dormir en la calle o en un lugar incómodo durante un viaje",
    "Viajé a un lugar que cambió mis valores o perspectiva",
    "Tuve que mentir sobre dónde estaba durante un viaje",
    "Viajé con alguien que no me caía bien pero terminamos siendo amigos",
    "Hice algo ilegal o cuestionable en un viaje",
    "Viajé a un lugar donde tuve miedo por mi seguridad",
    "Tuve una experiencia de viaje que me hizo llorar",
    "Viajé a un lugar que no recomendaría a nadie",
    "Tuve que volver a casa con una historia que nadie me creyó",
    "Viajé a un lugar donde hice algo completamente fuera de mi carácter",
    "Tuve una experiencia de viaje que me hizo apreciar mi hogar",
    "Viajé con dinero limitado y tuve que ser muy creativo",
    "Tuve un encuentro con alguien famoso o importante en un viaje",
    "Viajé a un lugar que siempre quise visitar y fue decepcionante",
  ];

  const viajesFamiliarData = historiasViajeQuestions.slice(0, 20).map((q) => ({
    packId: "historias-viaje",
    questionText: q,
    mode: "familiar",
  }));

  const viajesAdultosData = historiasViajeQuestions.map((q) => ({
    packId: "historias-viaje",
    questionText: q,
    mode: "adultos",
  }));

  await db.insert(questions).values([...viajesFamiliarData, ...viajesAdultosData]);
  console.log(`✅ Historias de Viaje: ${viajesFamiliarData.length} familiar + ${viajesAdultosData.length} adultos questions`);

  // Insert premium packs metadata
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
