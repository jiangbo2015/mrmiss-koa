import Router from "koa-router"
import fse from "fs-extra"
import path from "path"
import moment from "moment"
import { response } from "../utils"

const router = new Router()


export const handleUpload = async ctx => {
	const file = ctx.request.files.file
	// 创建可读流
	const reader = fse.createReadStream(file.path)

	let relativePath = [
		`uploads`,
		`${moment().format("YYYY-MM-DD")}`,
		`${new Date().getTime()}${path.extname(file.name)}`
	].join("/")
	let absPath = path.join(__dirname, "../public/" + relativePath)
	fse.ensureDirSync(path.dirname(absPath))

	// 创建可写流
	const upStream = fse.createWriteStream(absPath)
	// 可读流通过管道写入可写流
	reader.pipe(upStream)
	return relativePath
}
router.post("/upload", async (ctx, next) => {
	try {
		// 上传单个文件
		const relativePath = await handleUpload(ctx)
		ctx.body = response(true, { url: relativePath }, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
})

export default router.routes()