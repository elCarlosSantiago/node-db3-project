const db = require('../../data/db-config.js');

function find() {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.scheme_id', 'sc.scheme_name')
    .count('st.step_number as number_of_steps')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id');
}

async function findById(scheme_id) {
  const schemeInfo = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number');

  if (schemeInfo?.length > 0) {
    let formattedScheme = {
      scheme_id: parseInt(scheme_id),
      scheme_name: schemeInfo[0].scheme_name,
      steps: !schemeInfo[0].step_id
        ? []
        : schemeInfo.map((scheme) => {
            return {
              step_id: scheme.step_id,
              step_number: scheme.step_number,
              instructions: scheme.instructions,
            };
          }),
    };
    return formattedScheme;
  } else {
    return null;
  }
}

function findSteps(scheme_id) {
  return db('steps as st')
    .leftJoin('schemes as sc', 'st.scheme_id', 'sc.scheme_id')
    .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
    .where('st.scheme_id', scheme_id)
    .orderBy('st.step_number');
}

async function add(scheme) {
  const [scheme_id] = await db('schemes').insert(scheme);
  return findById(scheme_id);
}

async function addStep(scheme_id, step) {
  let stepToSend = {
    instructions: step.instructions,
    step_number: step.step_number,
    scheme_id: scheme_id,
  };

  await db('steps').insert(stepToSend);
  return db('steps')
    .where('steps.scheme_id', scheme_id)
    .orderBy('steps.step_number');
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
