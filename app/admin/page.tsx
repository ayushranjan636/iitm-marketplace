"use client"

import type React from "react"

import { useState } from "react"
import { Users, Package, AlertTriangle, Eye, Trash2, Ban, CheckCircle, TrendingUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for admin dashboard
const dashboardStats = {
  totalListings: 156,
  activeListings: 134,
  totalUsers: 89,
  reportsToday: 3,
  salesThisWeek: 45,
  popularCategory: "Mess Coupons",
}

const recentListings = [
  {
    id: 1,
    title: "Mess Coupon - Lunch (Non-Veg)",
    seller: "Anonymous User",
    category: "Mess Coupons",
    price: 45,
    status: "Active",
    reports: 0,
    createdAt: "2024-01-15 10:30",
  },
  {
    id: 2,
    title: "Hero Cycle - Good Condition",
    seller: "Anonymous User",
    category: "Cycles",
    price: 2500,
    status: "Active",
    reports: 1,
    createdAt: "2024-01-15 09:15",
  },
  {
    id: 3,
    title: "Inappropriate Content Example",
    seller: "Anonymous User",
    category: "Others",
    price: 100,
    status: "Reported",
    reports: 3,
    createdAt: "2024-01-15 08:45",
  },
]

const categoryStats = [
  { name: "Mess Coupons", count: 45, percentage: 28.8 },
  { name: "Cycles", count: 32, percentage: 20.5 },
  { name: "Electronics", count: 28, percentage: 17.9 },
  { name: "Furniture", count: 22, percentage: 14.1 },
  { name: "Clothing", count: 18, percentage: 11.5 },
  { name: "Others", count: 11, percentage: 7.1 },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple authentication check (in real app, this would be more secure)
    if (credentials.username === "admin" && credentials.password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid credentials")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-sm text-gray-500 text-center">Demo: admin / admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-blue-600">IITM Marketplace - Admin Panel</h1>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="listings">Manage Listings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalListings}</div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.activeListings} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{dashboardStats.reportsToday}</div>
                  <p className="text-xs text-muted-foreground">Needs attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales This Week</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{dashboardStats.salesThisWeek}</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${category.percentage}%` }} />
                        </div>
                        <span className="text-sm text-gray-500">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search listings..." className="pl-10" />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell>{listing.category}</TableCell>
                        <TableCell>₹{listing.price}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              listing.status === "Active"
                                ? "default"
                                : listing.status === "Reported"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {listing.reports > 0 ? (
                            <Badge variant="destructive">{listing.reports}</Badge>
                          ) : (
                            <span className="text-gray-500">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{listing.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Ban className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Reported Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentListings
                    .filter((item) => item.reports > 0)
                    .map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge variant="destructive">{item.reports} reports</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Category: {item.category} | Price: ₹{item.price}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.slice(0, 5).map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <span>{category.name}</span>
                        </div>
                        <Badge>{category.count} items</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>New Listings</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Items Sold</span>
                      <span className="font-semibold">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <span className="font-semibold">67</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Reports Filed</span>
                      <span className="font-semibold text-red-600">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
