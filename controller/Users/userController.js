const Controller = require("../mainController");
const jwt = require("jsonwebtoken");
const CustomError = require("../../helper/customErrorHelper");
const { salt, checkPassword } = require("../../helper/bcryptHelper");
const Ajv = require("ajv");

const secret = process.env.JWT_SECRET;

let ajv = new Ajv.default({ allErrors: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1, maxLength: 36 },
    name: { type: "string", minLength: 1, maxLength: 90 },
    email: { type: "string", minLength: 1, maxLength: 90 },
    password: { type: "string", minLength: 1, maxLength: 120 },
    password: { type: "string", minLength: 1, maxLength: 255 },
    isAdmin: { type: "boolean" },
  },
};

const validator = ajv.compile(schema);

function validateBody(body) {
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

class UserController extends Controller {
  constructor(body) {
    super("users");
    this.body = body;
  }
  validate() {
    validateBody(this.body);
    return this;
  }

  async register() {
    schema.required = ["name", "email", "password"];
    this.validate();

    this.body.isAdmin = false;
    //this.body.photo = `${process.env.HOSTNAME}/files/default.jpg`;
    const isEmailExist = await this.get({ email: this.body.email });
    if (isEmailExist.length) {
      throw new CustomError(409, "ER_DUP_ENTRY", "Email already registered");
    }
    this.body.password = await salt(this.body.password);
    await this.add(this.body);
    this.body.token = jwt.sign(this.body, secret, {
      expiresIn: "6h",
    });
  }

  async login() {
    schema.required = ["email", "password"];
    this.validate();

    let user = await this.get({ email: this.body.email });
    if (!user.length)
      throw new CustomError(
        404,
        "ERR_UNAVAILABLE",
        "Email has not been registered"
      );
    user = user[0];
    const isPassMatch = await checkPassword(this.body.password, user.password);
    if (!isPassMatch)
      throw new CustomError(400, "ERR_PASS_NOT_MATCH", "Wrong password");
    this.body.id = user.id;
    this.body.isAdmin = user.isAdmin;
    this.body.token = jwt.sign(this.body, secret, {
      expiresIn: "6h",
    });
  }
}

module.exports = UserController;
