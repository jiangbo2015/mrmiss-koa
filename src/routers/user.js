import Router from "koa-router"

import * as User from "../controlers/user"

const router = new Router()


router.post("/login", User.login)


router.post("/add", User.add)

router.get("/getCurrentUser", User.getCurrentUser)

router.get("/getList", User.getList)


 export default router.routes()