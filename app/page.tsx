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

// Mock data with enhanced properties
const mockListings = [
  {
    id: 1,
    title: "Mess Coupon - Lunch (Non-Veg)",
    price: 45,
    category: "Mess Coupons",
    condition: "New",
    timeLeft: "2 hours",
    location: "Online",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Anonymous",
    phone: "919876543210",
    isUrgent: true,
    status: "Available",
    bidsCount: 0,
    messName: "Nilgiri",
    mealType: "Lunch",
    postedTime: "2 hours ago",
  },
  {
    id: 2,
    title: "Hero Cycle - Good Condition",
    price: 2500,
    category: "Cycles",
    condition: "Used",
    timeLeft: "3 days",
    location: "Saraswati Hostel",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Anonymous",
    phone: "919876543211",
    status: "Available",
    bidsCount: 3,
    postedTime: "1 day ago",
  },
  {
    id: 3,
    title: "Study Table with Chair",
    price: 1200,
    category: "Furniture",
    condition: "Used",
    timeLeft: "1 week",
    location: "Ganga Hostel",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Anonymous",
    phone: "919876543212",
    status: "Available",
    bidsCount: 1,
    postedTime: "3 hours ago",
  },
  {
    id: 4,
    title: "iPhone Charger - Original",
    price: 800,
    category: "Electronics",
    condition: "New",
    timeLeft: "5 days",
    location: "Narmada Hostel",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Anonymous",
    phone: "919876543213",
    status: "Sold",
    bidsCount: 0,
    postedTime: "1 hour ago",
  },
  {
    id: 5,
    title: "MMM T-Shirt (Size L)",
    price: 300,
    category: "Clothing",
    condition: "Used",
    timeLeft: "2 days",
    location: "Kaveri Hostel",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Anonymous",
    phone: "919876543214",
    status: "Available",
    bidsCount: 2,
    postedTime: "5 hours ago",
  },
  {
    id: 6,
    title: "Movie Tickets - PVR (2 seats)",
    price: 500,
    category: "Tickets",
    condition: "New",
    timeLeft: "6 hours",
    location: "Online",
    image: "/placeholder.svg?height=200&width=300",
    seller: "Anonymous",
    phone: "919876543215",
    isUrgent: true,
    status: "Available",
    bidsCount: 0,
    postedTime: "30 minutes ago",
  },
]

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

  useEffect(() => {
    setMounted(true)
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

  const handleAddToWatchlist = (productId: number, productName: string) => {
    toast({
      title: "Added to Watchlist",
      description: `${productName} has been added to your watchlist`,
    })
  }

  const filteredListings = mockListings.filter((item) => {
    switch (selectedFilter) {
      case "Available Only":
        return item.status === "Available"
      case "Items with Bids":
        return item.bidsCount > 0
      case "Urgent Items":
        return item.isUrgent
      case "Recently Posted":
        return item.postedTime.includes("hour") || item.postedTime.includes("minutes")
      default:
        return true
    }
  })

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold iitm-text-gradient">BKL MarketPlace</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-red-100 text-red-800">
                IIT Madras Student Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Link href="/sell">
                <Button className="iitm-gradient text-white hover:opacity-90">Sell Item</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6 animate-slide-in">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search for items, mess coupons, cycles..." className="pl-10" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select defaultValue="All Categories">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
            Quick Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.slice(1).map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center space-y-2 hover:bg-red-50 hover:border-red-200 bg-transparent transition-all"
              >
                <Tag className="h-5 w-5 text-red-600" />
                <span className="text-xs text-center">{category}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Urgent/Time-Sensitive Items */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-red-600 flex items-center">
              🔥 <span className="ml-2">Urgent Items</span>
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockListings
              .filter((item) => item.isUrgent)
              .map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-all border-red-200 animate-slide-in">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-red-500 animate-pulse">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.timeLeft}
                      </Badge>
                      {item.status === "Sold" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <Badge className="bg-green-500 text-white">SOLD</Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                        [MESS]
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.postedTime}</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.condition}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full iitm-gradient text-white hover:opacity-90"
                      size="sm"
                      onClick={() => handleWhatsAppContact(item.phone, item.title)}
                      disabled={item.status === "Sold"}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

        {/* All Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Items ({filteredListings.length})</h2>
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredListings.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-all animate-slide-in">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
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
                    {item.status === "Sold" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                        <Badge className="bg-green-500 text-white text-lg">SOLD</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        item.category === "Mess Coupons"
                          ? "border-red-200 text-red-700"
                          : item.category === "Cycles"
                            ? "border-blue-200 text-blue-700"
                            : item.category === "Electronics"
                              ? "border-purple-200 text-purple-700"
                              : "border-gray-200 text-gray-700"
                      }`}
                    >
                      [
                      {item.category === "Mess Coupons"
                        ? "MESS"
                        : item.category === "Cycles"
                          ? "CYCLE"
                          : item.category === "Electronics"
                            ? "ELECTRONICS"
                            : item.category.toUpperCase()}
                      ]
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.postedTime}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-green-600">₹{item.price}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.condition}
                      </Badge>
                      {item.bidsCount > 0 && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          <Gavel className="h-3 w-3 mr-1" />
                          {item.bidsCount} bids
                        </Badge>
                      )}
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
                    onClick={() => handleWhatsAppContact(item.phone, item.title)}
                    disabled={item.status === "Sold"}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  {item.category !== "Mess Coupons" && item.status === "Available" && (
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
