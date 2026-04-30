import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { Card, CardContent, CardFooter } from './ui/card'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="border-none shadow-none rounded-none bg-transparent overflow-hidden transition-all hover:shadow-[0_30px_60px_-15px_rgba(26,28,26,0.04)]">
        <CardContent className="p-0 aspect-[4/5] relative overflow-hidden bg-muted">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-border/10 pointer-events-none" />
          {!product.is_available || product.stock_quantity === 0 ? (
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold tracking-widest uppercase text-red-500">
              Out of Collection
            </div>
          ) : product.stock_quantity <= 3 ? (
            <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
              Limited Stock: {product.stock_quantity}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 pb-6">
          <div className="flex justify-between w-full items-start gap-4">
            <div>
              <h3 className="font-serif text-lg leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2 text-[10px]">
                {product.category}
              </p>
            </div>
            <p className="font-sans text-base whitespace-nowrap">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
