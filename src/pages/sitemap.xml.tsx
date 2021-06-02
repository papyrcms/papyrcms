const Sitemap: React.FC = () => {
  const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://papyrcms.com/</loc>
  </url>
</urlset>
  `

  return <>{xml}</>
}

export default Sitemap
