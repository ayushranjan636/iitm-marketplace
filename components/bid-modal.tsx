"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gavel } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { bidAPI } from "@/lib/api"

interface BidModalProps {
  productTitle: string
  currentPrice: number
  productId: string
}

export function BidModal({ productTitle, currentPrice, productId }: BidModalProps) {
  const [bidData, setBidData] = useState({
    name: "",
    phone: "",
    bidPrice: "",
    note: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Number(bidData.bidPrice) <= currentPrice) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be higher than ₹${currentPrice}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await bidAPI.create({
        product_id: productId,
        bidder_name: bidData.name,
        bidder_contact: bidData.phone,
        bid_price: Number(bidData.bidPrice),
      })

      toast({
        title: "Bid Placed Successfully! 🎯",
        description: `Your bid of ₹${bidData.bidPrice} has been submitted to the seller`,
      })

      setBidData({ name: "", phone: "", bidPrice: "", note: "" })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Bid Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent" size="sm">
          <Gavel className="h-4 w-4 mr-2" />
          Place Bid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Gavel className="h-5 w-5 mr-2 text-orange-600" />
            Place Your Bid
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Item</Label>
            <p className="text-sm text-muted-foreground">{productTitle}</p>
            <p className="text-sm text-muted-foreground">Current Price: ₹{currentPrice}</p>
          </div>

          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={bidData.name}
              onChange={(e) => setBidData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="919876543210"
              value={bidData.phone}
              onChange={(e) => setBidData((prev) => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="bidPrice">Your Bid (₹) *</Label>
            <Input
              id="bidPrice"
              type="number"
              placeholder={`Higher than ${currentPrice}`}
              value={bidData.bidPrice}
              onChange={(e) => setBidData((prev) => ({ ...prev, bidPrice: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Any additional message for the seller..."
              value={bidData.note}
              onChange={(e) => setBidData((prev) => ({ ...prev, note: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="iitm-gradient text-white hover:opacity-90" disabled={loading}>
              {loading ? "Submitting..." : "Submit Bid"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
