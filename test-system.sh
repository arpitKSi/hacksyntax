#!/bin/bash

# VNIT E-Learning Platform - System Verification Test
# This script tests all critical functionality

echo "🧪 Starting System Verification Tests..."
echo "========================================"
echo ""

BASE_URL="http://localhost:3000"
EDUCATOR_EMAIL="educator@college.edu"
EDUCATOR_PASSWORD="demo123"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    local token="$6"
    
    echo -n "Testing: $name... "
    
    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $token")
        fi
    else
        if [ -n "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
        fi
    fi
    
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $status)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected $expected_status, got $status)"
        echo "Response: $body"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "📝 Test 1: Health Check"
echo "----------------------"
curl -s "$BASE_URL/" > /dev/null && echo -e "${GREEN}✅ Server is running${NC}" || echo -e "${RED}❌ Server is not running${NC}"
echo ""

echo "🔐 Test 2: Authentication"
echo "------------------------"

# Test login
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signin" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EDUCATOR_EMAIL\",\"password\":\"$EDUCATOR_PASSWORD\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✅ Login successful${NC}"
    echo "Token: ${ACCESS_TOKEN:0:20}..."
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    ((TESTS_FAILED++))
    echo ""
    echo "Cannot proceed with API tests without token"
    exit 1
fi
echo ""

echo "📚 Test 3: API Endpoints"
echo "------------------------"

# Test courses endpoint (protected)
test_endpoint "GET Courses List" "GET" "/api/courses" "" "200" "$ACCESS_TOKEN"

# Test user profile
test_endpoint "GET User Profile" "GET" "/api/auth/me" "" "200" "$ACCESS_TOKEN"

# Test assignments list
test_endpoint "GET Assignments" "GET" "/api/assignments" "" "200" "$ACCESS_TOKEN"

# Test quizzes list
test_endpoint "GET Quizzes" "GET" "/api/quizzes" "" "200" "$ACCESS_TOKEN"

# Test discussions list
test_endpoint "GET Discussions" "GET" "/api/discussions" "" "200" "$ACCESS_TOKEN"

echo ""
echo "🔒 Test 4: Security (Unauthorized Access)"
echo "-----------------------------------------"

# Test without token (should fail)
test_endpoint "Courses without auth" "GET" "/api/courses" "" "401" ""

# Test invalid token
test_endpoint "Courses with invalid token" "GET" "/api/courses" "" "401" "invalid_token_12345"

echo ""
echo "📊 Test Results"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! System is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review the errors above.${NC}"
    exit 1
fi
