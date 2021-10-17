CREATE TABLE [dbo].[PaymentTypes]
(
	[Id] varchar(20) not null,
	[Title] varchar(256) null,
	Constraint PK_PaymentTypes_Id Primary Key(Id),
)
