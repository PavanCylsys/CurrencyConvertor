require "test_helper"

class CurrencyConvertorControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get currency_convertor_index_url
    assert_response :success
  end
end
