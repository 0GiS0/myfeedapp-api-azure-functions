#variables
SUBSCRIPTION="Microsoft Azure Internal Consumption"
LOCATION="northeurope"
RESOURCE_GROUP="myfeedapp"
STORAGE_ACCOUNT="myfeedappstore"
FUNCTION_APP="myfeedappfunc"

#login
az login

#select subscription
az account set --subscription "Microsoft Azure Internal Consumption"

#create a resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

#create a storage account
az storage account create --name $STORAGE_ACCOUNT --location $LOCATION --resource-group $RESOURCE_GROUP --sku Standard_LRS

#create a function app
az functionapp create --resource-group $RESOURCE_GROUP --name $FUNCTION_APP --consumption-plan-location $LOCATION --runtime node --storage-account $STORAGE_ACCOUNT

#deploy on Azure
func azure functionapp publish $FUNCTION_APP --javascript

#added CORS configuration
az functionapp cors add --resource-group $RESOURCE_GROUP --name $FUNCTION_APP --allowed-origins http://localhost:3000
az functionapp cors show -g $RESOURCE_GROUP -n $FUNCTION_APP

#Delete all
az group delete --name $RESOURCE_GROUP --yes --no-wait