CREATE TABLE [dbo].[ProductInventory]
(
	[Id] INT NOT NULL Identity(1,1),
	[ProductId] int not null,
	[Quantity] decimal(10,2) not null,
	[RefNo] nvarchar(50) not null,
	[LastModifiedById] nvarchar(450) not null,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]),
	Constraint PK_ProductInventory_Id Primary Key(Id),
	Constraint FK_ProductInventory_ProductId Foreign Key(ProductId) references Products(Id),
	CONSTRAINT FK_ProductInventory_LastModifiedById FOREIGN KEY (LastModifiedById) REFERENCES AspNetUsers(Id),
)
