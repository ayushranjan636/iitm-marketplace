"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Grid,
  List,
  Heart,
  Clock,
  MapPin,
  Tag,
  MessageCircle,
  Gavel,
  Sun,
  Moon,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { productAPI } from "@/lib/api"
import { BidModal } from "@/components/bid-modal"

const categories = [
  "All Categories",
  "Mess Coupons",
  "Cycles",
  "Electronics",
  "Furniture",
  "Clothing",
  "Tickets",
  "Rentals",
  "Others",
]

const filterOptions = ["All Items", "Available Only", "Items with Bids", "Urgent Items", "Recently Posted"]

export default function MarketplacePage() {
  const [selectedFilter, setSelectedFilter] = useState("All Items")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    productAPI.getAll().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const handleWhatsAppContact = (phone: string, productName: string) => {
    const message = `Hey I'm contacting you to talk about your ${productName}`
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    toast({
      title: "Redirecting to WhatsApp",
      description: "Opening WhatsApp to contact the seller",
    })
  }

  const handleAddToWatchlist = (productId: string, productName: string) => {
    toast({
      title: "Added to Watchlist",
      description: `${productName} has been added to your watchlist`,
    })
  }

  // Filtering logic (update as needed)
  const filteredListings = products.filter((item) => {
    switch (selectedFilter) {
      case "Available Only":
        return !item.is_sold
      case "Items with Bids":
        return item.bidsCount && item.bidsCount > 0
      case "Urgent Items":
        return item.isUrgent
      case "Recently Posted":
        // Show items posted in the last 24 hours
        const postedDate = new Date(item.created_at)
        return Date.now() - postedDate.getTime() < 24 * 60 * 60 * 1000
      default:
        return true
    }
  })

  if (!mounted) return null

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Items ({filteredListings.length})</h2>
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}> <Grid className="h-4 w-4" /> </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}> <List className="h-4 w-4" /> </Button>
          </div>
        </div>
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredListings.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-all animate-slide-in">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleAddToWatchlist(item.id, item.title)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {item.isUrgent && <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">Urgent</Badge>}
                    {item.is_sold && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                        <Badge className="bg-green-500 text-white text-lg">SOLD</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="font-semibold text-lg">{item.title}</div>
                  <div className="text-gray-600">{item.description}</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-green-600">₹{item.price}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      {/* Optionally show bids count if you fetch it */}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 space-y-2">
                  <Button
                    className="w-full iitm-gradient text-white hover:opacity-90"
                    onClick={() => handleWhatsAppContact(item.seller_contact, item.title)}
                    disabled={item.is_sold}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  {/* Show Place Bid for non-coupon, available products */}
                  {!item.is_coupon && !item.is_sold && (
                    <BidModal productTitle={item.title} currentPrice={item.price} productId={item.id} />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
