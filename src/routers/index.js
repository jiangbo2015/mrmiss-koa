import Router from "koa-router"

import user from "./user"
import common from './common'


const router = new Router({
	prefix: "/api"
})

router.use("/user", user)
router.use("/common", common)


export default router
