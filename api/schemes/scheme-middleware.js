const db = require('../../data/db-config.js');

const checkSchemeId = async (req, res, next) => {
  const { scheme_id } = req.params;
  try {
    const scheme = await db('schemes').where('scheme_id', scheme_id).first();
    if (scheme) {
      next();
    } else {
      next({
        message: `scheme with scheme_id ${scheme_id} not found`,
        status: 404,
      });
    }
  } catch (err) {
    next(err);
  }
};

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;
  if (
    scheme_name === undefined ||
    typeof scheme_name !== 'string' ||
    !scheme_name.trim()
  ) {
    next({ message: 'invalid scheme_name', status: 400 });
  } else {
    next();
  }
};

const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;
  if (
    instructions === undefined ||
    typeof instructions !== 'string' ||
    !instructions.trim() ||
    step_number < 1 ||
    typeof step_number !== 'number'
  ) {
    next({ message: 'invalid step', status: 400 });
  } else {
    next();
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
