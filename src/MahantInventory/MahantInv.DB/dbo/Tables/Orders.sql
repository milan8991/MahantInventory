CREATE TABLE [dbo].[Orders]
(
	[Id] INT NOT NULL Identity(1,1),
	[ProductId] int not null,
	[Quantity] decimal(10,2) not null,
	[RefNo] nvarchar(50) not null,
	[StatusId] varchar(50) not null,
	[PaymentTypeId] varchar(20) not null,
	[PayerId] int not null,
	[PaidAmount] decimal(10,2) null,
	[LastModifiedById] nvarchar(450) not null,
	[ValidFrom] [datetime2](7) GENERATED ALWAYS AS ROW START NOT NULL,
	[ValidTo] [datetime2](7) GENERATED ALWAYS AS ROW END NOT NULL,
	PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]),
	Constraint PK_Orders_Id Primary Key(Id),
	Constraint FK_Orders_ProductId Foreign Key(ProductId) references Products(Id),
	Constraint FK_Orders_StatusId Foreign Key(StatusId) references OrderStatusTypes(Id),
	Constraint FK_Orders_PaymentTypeId Foreign Key(PaymentTypeId) references PaymentTypes(Id),
	Constraint FK_Orders_PayerId Foreign Key(PayerId) references Payers(Id),
	CONSTRAINT FK_Orders_LastModifiedById FOREIGN KEY (LastModifiedById) REFERENCES AspNetUsers(Id),
)

