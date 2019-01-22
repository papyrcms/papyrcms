class BlogRoutes { 

  constructor( server, app ) {

    this.app = app
    this.server = server

    this.registerRoutes()
  }


  registerRoutes() {

    this.server.get( '/blog', this.renderPage.bind( this, '' ) )
    this.server.get( '/blog/all', this.renderPage.bind( this, '_all' ) )
    this.server.get( '/blog/:id', this.renderPage.bind( this, '_show' ) )
  }


  renderPage( pageExtension, req, res ) {

    const actualPage = `/blog${pageExtension}`
    const id = !!req.params ? req.params.id : null
    const queryParams = { id }

    this.app.render(req, res, actualPage, queryParams)
  }
}

module.exports = BlogRoutes
