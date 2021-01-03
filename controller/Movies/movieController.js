const Controller = require("../mainController");
const CustomError = require("../../helper/customErrorHelper");
const Ajv = require("ajv");
const { cloneDeep } = require("lodash");
const dayjs = require("dayjs");

const ajv = new Ajv.default({ allErrors: true });

const strictSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1, maxLength: 36 },
    title: { type: "string", minLength: 1, maxLength: 60 },
    synopsis: { type: "string", minLength: 1, maxLength: 1000 },
    trailer: { type: "string", minLength: 1, maxLength: 255 },
    poster: { type: "string", minLength: 1, maxLength: 255 },
    directorName: { type: "string", minLength: 1, maxLength: 90 },
    featuredSong: { type: "string", minLength: 1, maxLength: 90 },
    budget: { type: "string", minLength: 1, maxLength: 16 },
    releaseDate: { type: "string" },
  },
  required: [
    "title",
    "synopsis",
    "trailer",
    "poster",
    "directorName",
    "featuredSong",
    "budget",
  ],
  additionalProperties: false,
};

const strictValidator = ajv.compile(strictSchema);

const looseSchema = cloneDeep(strictSchema);
delete looseSchema.required;
const looseValidator = ajv.compile(looseSchema);

function validateBody(body, isLoose) {
  const validator = isLoose ? looseValidator : strictValidator;
  const isValid = validator(body);
  if (!isValid) {
    throw new CustomError(
      400,
      "ERR_VALIDATION",
      "Wrong body",
      validator.errors.map((err) => `${err.dataPath} ${err.message}`).join()
    );
  }
}

function convertISODate(isoDate) {
  return dayjs(isoDate).format("YYYY-MM-DD");
}

class MovieController extends Controller {
  constructor(body) {
    super("movies");
    this.body = body;
  }

  validate() {
    validateBody(this.body);
    return this;
  }

  looseValidate() {
    validateBody(this.body, true);
    return this;
  }

  async find() {
    const result = await this.get(this.body);
    if (!result.length) {
      throw new CustomError(404, "ERR_NOT_FOUND", "DATA NOT FOUND");
    }
    return result;
  }

  async create() {
    const result = await this.get(this.body);
    if (result.length) {
      throw new CustomError(409, "ERR_DUP_ENTRY", "DATA ALREADY EXIST");
    }
    this.body.releaseDate = convertISODate(this.body.releaseDate);
    return this.add(this.body);
  }
}

module.exports = MovieController;
