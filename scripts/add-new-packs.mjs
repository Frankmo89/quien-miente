import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const newPacks = [
  {
    packId: 'office-secrets',
    name: 'Office Secrets',
    description: 'Secretos de oficina, dinámicas laborales y confesiones profesionales',
    mode: 'adultos',
    price: 299, // $2.99
    stripePriceId: 'price_office_secrets' // Will be set after creating in Stripe
  },
  {
    packId: 'extreme-travel',
    name: 'Extreme Travel Anecdotes',
    description: 'Historias de viaje intensas, peligrosas y transformadoras',
    mode: 'both',
    price: 299, // $2.99
    stripePriceId: 'price_extreme_travel' // Will be set after creating in Stripe
  }
];

const officeSecretsQuestions = [
  'He visto a mi jefe haciendo algo en la oficina que cambiaría completamente cómo lo ven los demás',
  'Una vez usé información confidencial de la empresa para beneficio personal',
  'Sé que un colega está siendo pagado mucho más que yo por el mismo trabajo',
  'He fingido estar ocupado para no ayudar a un colega que me cae mal',
  'Mi jefe me pidió que hiciera algo éticamente cuestionable y lo hice',
  'He visto a un colega sabotear el trabajo de otro para quedar bien',
  'Una vez tomé crédito por el trabajo de alguien más en una reunión importante',
  'Sé que mi colega está buscando otro trabajo y no se lo ha dicho al jefe',
  'He mentido en mi CV para conseguir este trabajo',
  'Mi jefe tiene una relación inapropiada con alguien del equipo y todos lo sabemos',
  'He visto a un ejecutivo siendo cruel con un empleado junior en privado',
  'Una vez le conté a un amigo información confidencial de la empresa',
  'Sé que mi compañero de equipo está copiando código de internet sin dar crédito',
  'He fingido que no entendía algo en una reunión para evitar más trabajo',
  'Mi jefe me pidió que no contara algo importante a mis colegas',
  'He visto a alguien en la oficina haciendo algo completamente fuera de su rol',
  'Una vez rechacé una oportunidad de trabajo porque sabía que afectaría a un amigo',
  'Sé que mi empresa está haciendo algo ilegal pero nadie lo menciona',
  'He escuchado a mi jefe hablar mal de alguien del equipo cuando no está',
  'Una vez envié un email a la persona equivocada con información sensible',
  'Sé que un colega está en una relación con alguien del trabajo y lo ocultan',
  'He visto a alguien en la oficina llorando en el baño y no supe qué hacer',
  'Mi jefe me pidió que evaluara a alguien que sé que está siendo tratado injustamente',
  'Una vez fingí estar enfermo para no ir a una reunión importante',
  'Sé que mi empresa está a punto de despedir a alguien y no puedo decirle',
  'He visto a un colega siendo acosado en la oficina pero no intervine',
  'Una vez tomé un día de vacaciones pero trabajé desde casa sin decirlo',
  'Sé que mi colega está plagiando el trabajo de otra persona en la universidad',
  'He visto a mi jefe siendo inapropiado con un cliente pero nadie dijo nada',
  'Una vez rechacé un ascenso porque sabía que significaba supervisar a un amigo'
];

const extremeTravelQuestionsFamiliar = [
  'Estuve a punto de perderme completamente en una ciudad extranjera sin dinero ni teléfono',
  'Tuve una enfermedad seria en el extranjero y tuve que volver a casa de emergencia',
  'Viajé a un lugar donde presencié algo que cambió mi perspectiva sobre el mundo',
  'Me robaron algo valioso en un viaje y tuve que improvisar el resto del viaje',
  'Viajé a un lugar donde hice algo que mis papás nunca se enteraron',
  'Tuve que dormir en la calle durante un viaje porque se me acabó el dinero',
  'Conocí a alguien en un viaje que me salvó de una situación peligrosa',
  'Viajé a un lugar que era completamente diferente a lo que esperaba',
  'Hice algo peligroso en un viaje que no volvería a hacer',
  'Viajé con alguien y la relación cambió drásticamente después',
  'Tuve un accidente en un viaje que casi me cuesta la vida',
  'Viajé a un lugar donde no hablaba el idioma y pasó algo cómico',
  'Conocí a alguien en un viaje y tuvimos una conexión especial',
  'Viajé a un lugar que me hizo replantear mis valores',
  'Tuve que volver a casa antes de lo planeado por una razón importante',
  'Viajé a un lugar peligroso sin que mis papás lo supieran',
  'Hice algo en un viaje que me avergüenza recordar',
  'Viajé con alguien que no me caía bien pero terminamos siendo amigos',
  'Tuve una experiencia espiritual o transformadora en un viaje',
  'Viajé a un lugar donde tuve miedo por mi seguridad',
  'Tuve una experiencia de viaje que me hizo llorar',
  'Viajé a un lugar que no recomendaría a nadie',
  'Tuve que volver a casa con una historia que nadie me creyó',
  'Viajé a un lugar donde hice algo completamente fuera de mi carácter',
  'Tuve una experiencia de viaje que me hizo apreciar mi hogar',
  'Viajé con dinero limitado y tuve que ser muy creativo',
  'Tuve un encuentro con alguien famoso o importante en un viaje',
  'Viajé a un lugar que siempre quise visitar y fue decepcionante',
  'Tuve que mentir sobre dónde estaba durante un viaje',
  'Viajé a un lugar donde presencié algo que nunca olvidaré'
];

const extremeTravelQuestionsAdultos = [
  'Tuve una aventura romántica en un viaje que nadie sabe',
  'Viajé a un lugar donde hice algo ilegal o cuestionable',
  'Tuve que gastar dinero de emergencia en un viaje para resolver un problema',
  'Viajé a un lugar donde presencié algo que cambió mi perspectiva sobre la vida',
  'Me robaron algo valioso en un viaje y tuve que mentir sobre lo que pasó',
  'Tuve que dormir en la calle durante un viaje por decisión propia',
  'Conocí a alguien en un viaje y tuvimos una conexión que casi arruina mi relación',
  'Viajé a un lugar donde presencié abuso o injusticia pero no intervine',
  'Hice algo peligroso en un viaje que casi me cuesta la vida',
  'Viajé con alguien y tuvimos un conflicto serio que casi arruina la amistad',
  'Tuve un accidente en un viaje que oculté a mi familia',
  'Viajé a un lugar donde hice algo que va contra mis principios',
  'Conocí a alguien en un viaje y casi me quedo en ese lugar',
  'Viajé a un lugar donde presencié corrupción o crimen',
  'Tuve que mentir a mi pareja sobre dónde estuve en un viaje',
  'Viajé a un lugar donde fue ofrecido algo ilegal y casi lo acepté',
  'Tuve una experiencia traumática en un viaje que nunca conté',
  'Viajé con dinero que no era completamente mío',
  'Hice algo en un viaje que cambió quién soy',
  'Viajé a un lugar donde presencié algo que me hizo cuestionar mis creencias',
  'Tuve que gastar dinero de emergencia en un viaje para ayudar a alguien',
  'Viajé a un lugar donde casi pierdo a alguien importante',
  'Hice algo en un viaje que me hizo sentir culpable después',
  'Viajé a un lugar donde presencié desigualdad extrema',
  'Tuve una relación breve en un viaje que fue intensa',
  'Viajé a un lugar donde hice algo que me avergüenza profundamente',
  'Tuve que elegir entre continuar un viaje o volver por algo importante',
  'Viajé a un lugar donde presencié belleza que me cambió la vida',
  'Hice algo en un viaje que nunca le contaría a mi pareja',
  'Viajé a un lugar donde tuve que confrontar mis miedos más profundos'
];

async function addNewPacks() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Insert new packs
    for (const pack of newPacks) {
      await connection.execute(
        'INSERT INTO question_packs (pack_id, name, description, mode, price, stripe_price_id) VALUES (?, ?, ?, ?, ?, ?)',
        [pack.packId, pack.name, pack.description, pack.mode, pack.price, pack.stripePriceId]
      );
      console.log(`✓ Pack "${pack.name}" created`);
    }

    // Insert Office Secrets questions
    for (const question of officeSecretsQuestions) {
      await connection.execute(
        'INSERT INTO questions (pack_id, mode, question_text) VALUES (?, ?, ?)',
        ['office-secrets', 'adultos', question]
      );
    }
    console.log(`✓ ${officeSecretsQuestions.length} Office Secrets questions added`);

    // Insert Extreme Travel questions (Familiar)
    for (const question of extremeTravelQuestionsFamiliar) {
      await connection.execute(
        'INSERT INTO questions (pack_id, mode, question_text) VALUES (?, ?, ?)',
        ['extreme-travel', 'familiar', question]
      );
    }
    console.log(`✓ ${extremeTravelQuestionsFamiliar.length} Extreme Travel (Familiar) questions added`);

    // Insert Extreme Travel questions (Adultos)
    for (const question of extremeTravelQuestionsAdultos) {
      await connection.execute(
        'INSERT INTO questions (pack_id, mode, question_text) VALUES (?, ?, ?)',
        ['extreme-travel', 'adultos', question]
      );
    }
    console.log(`✓ ${extremeTravelQuestionsAdultos.length} Extreme Travel (Adultos) questions added`);

    console.log('\n✅ All new packs and questions added successfully!');
    console.log('\nNext steps:');
    console.log('1. Create Stripe products for these packs');
    console.log('2. Update the stripePriceId values in the database with actual Stripe Price IDs');
    console.log('3. Test the purchase flow in the Store');

  } catch (error) {
    console.error('Error adding new packs:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

addNewPacks();
