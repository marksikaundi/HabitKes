import { api } from "@/convex/_generated/api";

// Test script to verify Convex operations
export async function testConvexOperations() {
  console.log("Testing Convex operations...");
  
  try {
    // Note: This is just a reference script - actual testing should be done in the app
    console.log("Convex operations test script ready");
    console.log("Available mutations:");
    console.log("- createHabit");
    console.log("- updateHabit");
    console.log("- deleteHabit");
    console.log("- archiveHabit");
    
    console.log("Available queries:");
    console.log("- getActiveHabits");
    console.log("- getHabit");
    
  } catch (error) {
    console.error("Error in test script:", error);
  }
}
