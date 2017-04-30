require 'test_helper'

class FoodFinderControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get food_finder_index_url
    assert_response :success
  end

end
