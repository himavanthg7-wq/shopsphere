package com.shopsphere.dto.response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private BigDecimal totalSales = BigDecimal.ZERO;
    private Long totalOrders = 0L;
    private Long totalCustomers = 0L;
    private Long totalProducts = 0L;
    private Map<String, Long> ordersByStatus = new HashMap<>();
    private List<TopProductDto> topProducts = new ArrayList<>();
    private List<ProductResponse> lowStockProducts = new ArrayList<>();
    private List<MonthlySalesDto> monthlySales = new ArrayList<>();

    public DashboardStatsResponse() {}

    public static class TopProductDto {
        private String name;
        private Long quantitySold;
        private BigDecimal revenue;

        public TopProductDto() {}
        public TopProductDto(String name, Long quantitySold, BigDecimal revenue) {
            this.name = name;
            this.quantitySold = quantitySold;
            this.revenue = revenue;
        }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Long getQuantitySold() { return quantitySold; }
        public void setQuantitySold(Long quantitySold) { this.quantitySold = quantitySold; }
        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    public static class MonthlySalesDto {
        private String month;
        private BigDecimal sales;

        public MonthlySalesDto() {}
        public MonthlySalesDto(String month, BigDecimal sales) {
            this.month = month;
            this.sales = sales;
        }
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public BigDecimal getSales() { return sales; }
        public void setSales(BigDecimal sales) { this.sales = sales; }
    }

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

    public List<TopProductDto> getTopProducts() { return topProducts; }
    public void setTopProducts(List<TopProductDto> topProducts) { this.topProducts = topProducts; }

    public List<ProductResponse> getLowStockProducts() { return lowStockProducts; }
    public void setLowStockProducts(List<ProductResponse> lowStockProducts) { this.lowStockProducts = lowStockProducts; }

    public List<MonthlySalesDto> getMonthlySales() { return monthlySales; }
    public void setMonthlySales(List<MonthlySalesDto> monthlySales) { this.monthlySales = monthlySales; }
}
