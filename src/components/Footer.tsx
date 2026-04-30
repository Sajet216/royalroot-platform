import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-primary/5 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6 col-span-1 md:col-span-1">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-2xl tracking-tight text-primary">RoyalRoot</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-secondary -mt-1">Interiors</span>
            </Link>
            <p className="text-sm text-primary/60 max-w-xs leading-relaxed">
              Curating heritage craftsmanship for the modern architectural home. Established 2026.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Collections</h4>
            <ul className="space-y-3">
              {[
                { name: 'Living Room', slug: 'living' },
                { name: 'Bedroom', slug: 'bedroom' },
                { name: 'Office', slug: 'office' },
                { name: 'Dining Room', slug: 'dining' }
              ].map(item => (
                <li key={item.name}>
                  <Link href={`/category/${item.slug}`} className="text-sm text-primary/60 hover:text-secondary transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Information</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Journal', path: '/journal' },
                { name: 'Shop All', path: '/shop' },
                { name: 'Contact Us', path: '/contact' }
              ].map(item => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-primary/60 hover:text-secondary transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Inquiries</h4>
            <ul className="space-y-3 text-sm text-primary/60 leading-loose">
              <li><a href="mailto:concierge@royalroot.interiors" className="hover:text-secondary">concierge@royalroot.interiors</a></li>
              <li><a href="tel:+12128821974" className="hover:text-secondary">+1 (212) 882-1974</a></li>
              <li>42nd Heritage Way,<br />Manhattan, NY 10012</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
            &copy; 2026 RoyalRoot Interiors. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Shipping', 'Heritage'].map(item => (
              <Link key={item} href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
            <Link href="/admin/login" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
              Curator Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
