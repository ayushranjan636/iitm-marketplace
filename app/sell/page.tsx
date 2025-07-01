"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, X, Clock, Tag, DollarSign, MessageCircle, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const categories = ["Mess Coupons", "Cycles", "Electronics", "Furniture", "Clothing", "Tickets", "Rentals", "Others"]

const hostels = [
  "Mandakini",
  "Saraswati",
  "Ganga",
  "Narmada",
  "Kaveri",
  "Godavari",
  "Tapti",
  "Cauvery",
  "Brahmaputra",
  "Mahanadi",
  "Krishna",
  "Sindhu",
]

const conditions = ["New", "Like New", "Good", "Fair", "Poor"]

const messNames = ["Nilgiri", "SGR", "K Star", "Himalaya", "Vindhya", "Satpura"]
const mealTypes = ["Breakfast", "Lunch", "Dinner"]

interface MessCouponQuantity {
  mealType: string
  quantity: number
}

export default function SellPage() {
  const [images, setImages] = useState<string[]>([])
  const [messQuantities, setMessQuantities] = useState<MessCouponQuantity[]>([
    { mealType: "Breakfast", quantity: 0 },
    { mealType: "Lunch", quantity: 0 },
    { mealType: "Dinner", quantity: 0 },
  ])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    condition: "",
    location: "Online",
    contactMethod: "whatsapp",
    contactInfo: "",
    autoExpiry: false,
    expiryDate: "",
    expiryTime: "",
    messName: "",
    mealType: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMessQuantity = (mealType: string, change: number) => {
    setMessQuantities((prev) =>
      prev.map((item) =>
        item.mealType === mealType ? { ...item, quantity: Math.max(0, item.quantity + change) } : item,
      ),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.category === "Mess Coupons") {
      const totalCoupons = messQuantities.reduce((sum, item) => sum + item.quantity, 0)
      if (totalCoupons === 0) {
        toast({
          title: "Error",
          description: "Please add at least one mess coupon quantity",
          variant: "destructive",
        })
        return
      }
    }

    // Handle form submission
    console.log("Form submitted:", formData, messQuantities)

    toast({
      title: "Item Posted Successfully! 🎉",
      description: "Your item has been listed on BKL MarketPlace",
    })

    // Reset form
    setFormData({
      title: "",
      category: "",
      description: "",
      price: "",
      condition: "",
      location: "Online",
      contactMethod: "whatsapp",
      contactInfo: "",
      autoExpiry: false,
      expiryDate: "",
      expiryTime: "",
      messName: "",
      mealType: "",
    })
    setImages([])
    setMessQuantities([
      { mealType: "Breakfast", quantity: 0 },
      { mealType: "Lunch", quantity: 0 },
      { mealType: "Dinner", quantity: 0 },
    ])
  }

  const isMessCoupons = formData.category === "Mess Coupons"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <h1 className="text-xl font-bold iitm-text-gradient">Sell Your Item</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-red-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Item Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mess Coupon - Lunch (Non-Veg)"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!isMessCoupons && (
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                      required={!isMessCoupons}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item, its condition, and any other relevant details..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mess Coupon Specific Fields */}
          {isMessCoupons && (
            <Card className="animate-slide-in border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">🍱 Mess Coupon Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="messName">Mess Name *</Label>
                    <Select
                      value={formData.messName}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, messName: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mess" />
                      </SelectTrigger>
                      <SelectContent>
                        {messNames.map((mess) => (
                          <SelectItem key={mess} value={mess}>
                            {mess}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Coupon Quantities *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {messQuantities.map((item) => (
                      <Card key={item.mealType} className="p-4">
                        <div className="text-center">
                          <Label className="font-medium">{item.mealType}</Label>
                          <div className="flex items-center justify-center space-x-3 mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateMessQuantity(item.mealType, -1)}
                              disabled={item.quantity === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-xl font-bold w-8 text-center">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateMessQuantity(item.mealType, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing and Location */}
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Pricing & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">{isMessCoupons ? "Price per Coupon (₹) *" : "Price (₹) *"}</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      {hostels.map((hostel) => (
                        <SelectItem key={hostel} value={hostel}>
                          {hostel} Hostel
                        </SelectItem>
                      ))}
                      <SelectItem value="Campus">Campus</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Photos (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload up to 5 photos of your item</p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>Choose Photos</span>
                    </Button>
                  </Label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                WhatsApp Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactInfo">WhatsApp Number (with country code) *</Label>
                <Input
                  id="contactInfo"
                  placeholder="919876543210"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Format: 919876543210 (without + or spaces)</p>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Expiry Settings */}
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Auto-Expiry Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-expiry"
                  checked={formData.autoExpiry}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, autoExpiry: checked }))}
                />
                <Label htmlFor="auto-expiry">Auto-expire this listing (useful for mess coupons, event tickets)</Label>
              </div>

              {formData.autoExpiry && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input
                      id="expiry-date"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry-time">Expiry Time</Label>
                    <Input
                      id="expiry-time"
                      type="time"
                      value={formData.expiryTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expiryTime: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="iitm-gradient text-white hover:opacity-90">
              Post Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
