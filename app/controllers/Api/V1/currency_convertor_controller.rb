require 'httparty'
require 'json'


class Api::V1::CurrencyConvertorController < ApplicationController
  def convert
    begin
      amount = params[:amount].to_f
      from_currency = params[:from]
      to_currency = params[:to]

      conversion_rate = fetch_conversion_rate(from_currency, to_currency)
      converted_amount = amount * conversion_rate

      render json: { converted_amount: converted_amount }
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end

  def save_data
    begin
      # Logic to fetch the data from the API
      response = HTTParty.get('https://api.exchangerate-api.com/v4/latest/USD')
      data = JSON.parse(response.body)
  
      # Save fetched data into the database
      saved_data = []
  
      data['rates'].each do |currency_name, currency_rate|
        currency = Currency.new(currency_name: currency_name, currency_rate: currency_rate)
        if currency.save
          saved_data << currency
        else
          render json: { error: currency.errors.full_messages }, status: :unprocessable_entity
          return
        end
      end
  
      render json: saved_data, status: :ok
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end
  
  
  def fetch_data
    @currency = Currency.all
    render json: @currency
  end

  private

  def fetch_conversion_rate(from_currency, to_currency)
    api_key = 'b164ef016c0d019e710181db'
    base_url = "https://api.exchangerate-api.com/v4/latest/USD"

    response = HTTParty.get("#{base_url}?base_currency=#{from_currency}&symbols=#{to_currency}")
    data = JSON.parse(response.body)

    if data['error']
      raise StandardError, "API Error: #{data['error']}"
    end

    from_rate = data['rates'][from_currency]
    to_rate = data['rates'][to_currency]

    if from_rate.nil? || to_rate.nil?
      raise StandardError, "Currency conversion rates not found"
    end

    conversion_rate = to_rate / from_rate

    return conversion_rate
  end
end