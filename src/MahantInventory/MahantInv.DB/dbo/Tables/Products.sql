CREATE TABLE [dbo].[Products]
(
	[Id] INT NOT NULL Identity(1,1),
	[Name] varchar(255) not null,
	[UnitTypeCode] varchar(12) not null,
	[Enabled] bit not null,
	Constraint PK_Products_Id Primary Key(Id),
	Constraint FK_Products_UnitTypeId Foreign Key(UnitTypeCode) references UnitTypes(Code),
	Constraint CUK_Name_UnitTypeId Unique([Name], UnitTypeCode)
)
