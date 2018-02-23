package com.stressmanager;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.*;
import com.amazonaws.regions.Regions;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.model.*;

import java.util.*;



public class DBSetup {

    //used for Localtesting
    static AmazonDynamoDBClient localtest = new AmazonDynamoDBClient()
        .withEndpoint("http://localhost:8080");

    //used for remote testing
    static AmazonDynamoDB remotetest;

    //the current instance of DynamoDB
    static DynamoDB currentDB;

    public static void localDB() {
        //currentDB = new DynamoDB(localtest);
    }

    public static void remoteDB() {
        remotetest = AmazonDynamoDBClientBuilder.standard()
            .withRegion(Regions.US_WEST_2)
            .withCredentials(new DefaultAWSCredentialsProviderChain())
            .build();
        currentDB = new DynamoDB(remotetest);

    }

    public static Table getUsersTable() {
        return currentDB.getTable("Users");
    }
    public static Table getTable(String name) {
        name = name.replaceAll(" ","_");
        System.out.println("meow: " + name);
        return currentDB.getTable(name);
    }
    public static int createTable(String username) {

        try{
            CreateTableRequest request = new CreateTableRequest(
                Arrays.asList(//parameter 1
                    new AttributeDefinition("eventID", ScalarAttributeType.S)),
                username,//parameter 2
                Arrays.asList(///parameter 3
                    new KeySchemaElement("eventID", KeyType.HASH)),
                new ProvisionedThroughput(10L, 10L));//parameter 4

            currentDB.createTable(request)
                .waitForActive();//wait for the Table to be up before you send the okay
            System.out.println(Colors.ANSI_YELLOW+"NEW TABLE WAS CREATED"+Colors.ANSI_WHITE);
            return 200;
        } catch(Exception e) {
            System.out.println("Shit has hit the fan and this reason is: "+e.getMessage());
            return 500;
        }
    }


    public Table getTableForUser(String username) {
        return currentDB.getTable(username);
    }
}
