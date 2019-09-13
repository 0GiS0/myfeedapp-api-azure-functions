#variables
SUBSCRIPTION="YOUR_SUBSCRIPTION_NAME"
LOCATION="northeurope"
RESOURCE_GROUP="myfeedapp"
COSMOSDB="myfeedappdb"

#login
az login

#select subscription
az account set --subscription $SUBSCRIPTION

#create a resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

#create a cosmosdb
az cosmosdb create --name $COSMOSDB --resource-group $RESOURCE_GROUP --kind MongoDB