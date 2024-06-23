
# Introduction 

## Planning 
- Create Project 
- Market Existance 
- Possible Profit 
- Needed Capital 
- Delivery Component 

## Purchase 
- BOM 
- Initial Price 
- Warehouse Insert 

## Project Management 
- Version Control Project 
- Project Documentation 

## Build 
- Build Step 
- Count How Much Able to Build

## Sales Planning 
- Sales Description 
- Store Outlet (Market)
- Store Tax or Promo Cut Price 
- Product Packaging and Delivery 
- Income Presentage 
- Cost Of Good 

## Sales Management 
- Customer Feedback 
- Market Price Change 

## Report
- Sell Product Report 
- Income And Capital
- Monthly / Weekly Report 

## History
- Component / Stock / Price History 
- Sell History 
- Money History 

# Entity Diagram Overview

```mermaid
---
title: Project Entity Relationship Overview
---
erDiagram
    Project }|--|{ Component : contains
    Project }|--o{ ResourceDocument : contains
    Project ||--|| BOM : contains
    Project ||--o{ Feedback : contains
    Project ||--|{ History : contains
    Project ||--|{ SalesPlan : contains

    Component ||--o{ BuildStep: Have
    Component }|--|{ Storage: Have
    Component |o--o{ Component : CanHave
    Component ||--|{ Parameter : Have
    Component }|--o{ Stock : Have

    Stock ||--o{ History : Contains

    SalesPlan ||--o{ SalesVariable : Have

    SalesVariable ||--o{ History : Have

    Project{
        int Id 
        string Name 
        DateTime CreatedDate 
        DateTime DeadLineDate 
        DateTime LastUpdatedDate 
        DateTime FinishedDate 
        double SellPrice 
        double Capital 
        bool Fail 
        bool Finish 
        double ProfitInPersen 
        string Description 
    }

    Component {
        int Id 
        string Name
        currency SellPrice
        currency Capital
        bool IsAssembly
        ResourceDocument Document
        string Description
        int BuildStepId
    }

    History {
        int Id 
        date LastUpdatedDate
        date GoodsLastUpdate
    }
    SalesPlan{
        int Id
        string Description
        int MarketId
    }

    Storage {
        int Id
        string Description
    }

    ResourceDocument{
        int Id 
        string Overview
        string Description
    }

    BuildStep{
        int Id 
        string Overview
        string Description
        string[] Steps
        ResourceDocument Document 
    }
    Parameter {
        int Id 
        map ParameterMap
    }
    Feedback{
        int Id 
        string Overview 
        string Description
    }
    BOM{
        int Id 
        int ProjectId 
        int[] ComponentId
        string Notes
    }
    Stock{
        int Id 
        int Count 
        string Overview
    }
    SalesVariable{
        int Id 
        int ProjectId 
        currency Tax
        currency MarketTax
        currency Discount
        currency Delivery 
        currency Return
    }
```


