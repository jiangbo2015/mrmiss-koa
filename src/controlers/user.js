import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import config from "../config"
import { response } from "../utils"

/**
 * 获取token中的值
 * @param {*} token
 */
const verify = token => jwt.verify(token.split(" ")[1], config.secret)

export const login = async (ctx, next) => {
	const { account, password } = ctx.request.body
	try {
		const [data, fields] = await ctx.db.query('select * from user where account = ? and password = ?',  [account, password])
		if (!data[0]) {
			ctx.body = response(false, null, "用户名或密码错误")
		} else {
			let token = jwt.sign(account, config.secret)
			console.log(token)
			ctx.body = response(true, { ...data[0], token })
		}
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

/**
 * 兼容其他需要获取当前用户信息的地方，使用promise处理
 */
export const getCurrentUser = (ctx, next) => {
	return new Promise(async (resolve, reject) => {
		try {
			const account = verify(ctx.headers.authorization)
			const [data, fields] = await  ctx.db.query('select * from user where account = ?', [account])
			ctx.body = response(true, data[0])
			resolve(data)
		} catch (err) {
			ctx.body = response(false, null, err.message)
			reject(err)
		}
	})
}

export const add = async (ctx, next) => {
	try {
		const { account, password, name } = ctx.request.body
		let [data, fields] = await ctx.db.query('insert into user set ?', [{
			account,
			name,
			password
		}])
		
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}



/**
 * 注意对数组形式的字段进行查询的处理
 */

export const getList = async (ctx, next) => {
	
	try {
		
		let [data] = await ctx.db.transaction('select * from user')
		console.log(data)
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

