#Constants
mongoNetworkName='mongo-cluster'
username="admin"
password="admin"
dbname="shoppers"

##Spinner Function Start
sp='/-\|'
sc=0
spin() {
   printf "\r${sp:sc++:1} $1"
   ((sc==${#sp})) && sc=0
}
endspin() {
   printf "\r%s\n" "$@"
}

some_work() {
   mongoStatus=$(docker pull mongo:latest | grep 'Status:')
}
#Spinner End

#Executing pull for mongodb latest
until [ "${mongoStatus}" != "" ]; do
   spin "Checking MongoDB Image"
   some_work
done
endspin
echo ${mongoStatus}
echo ""

echo "Adding a new network for our cluster called: ${mongoNetworkName}"
docker network create ${mongoNetworkName}
echo ""

echo "Network ${mongoNetworkName} added with:"
echo "NETWORK ID     NAME            DRIVER    SCOPE"
docker network ls | grep ${mongoNetworkName}
echo ""

echo "Creating mongodb docker container and exposing it at port 6565"
docker-compose up --build -d
echo ""

echo "Container mongodb created!"
echo "${dbname} Database accessible with Username: ${username} and Password: ${password}"

# read -p "Would you like to execute your container? (bash/mongo/no) " response
# if [ "${response}" == "bash" ]
# then
#     echo -e "Here you go:"
#     docker exec -it mongodb bash
# elif [ "${response}" == "mongo" ]
# then
#     echo -e "Here you go:"
#     echo -e "Accessing database using root user"
#     docker exec -it mongodb mongo --authenticationDatabase ${dbname}
# else
#     echo -e "Okay!"
# fi

echo "Thank you!"