import serverContext from "@/serverContext"


export default async (req, res) => {

  const { user, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const { Order, findAll } = database
    const options = {
      sort: { created: -1 },
      include: ['user', 'products']
    }
    const orders = await findAll(Order, {}, options)

    return await done(200, orders)
  }

  return await done(404, { message: 'Page not found.' })
}
