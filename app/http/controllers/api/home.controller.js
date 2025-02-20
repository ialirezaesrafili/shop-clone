const { cache } = require("@hapi/joi/lib/base");
const { authSchema } = require("../../validators/user/useer.schema");
const Controller = require("../controller");
const createError = require('http-errors');

module.exports =new class HomeController extends Controller{
     async indexPage(req, res, next) {
         try {
            const result = await authSchema.validateAsync(req.body)
            return res.status(200).send("Index Page Store");
          }
         catch (error) {
             next(createError.BadRequest(error.message));
         }
    }   
}
