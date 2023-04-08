CREATE TABLE Stores (
	StoreID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	StoreName varchar(255) NOT NULL
);

CREATE TABLE List (
	FoodID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	FoodName varchar(255) NOT NULL,
	Quantity int NOT NULL,
	Active boolean DEFAULT TRUE
);

CREATE TABLE Inventory (
	ItemID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ItemName varchar(255) NOT NULL,
	Stock int,
	Price double(5,2),
	PurchaseDate DATE
);

CREATE TABLE PurchaseFrom (
	StoreID int,
	ItemID int,
	FOREIGN KEY (StoreID) REFERENCES Stores(StoreID),
	FOREIGN KEY (ItemID) REFERENCES Inventory(ItemID) ON DELETE CASCADE
);