Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post '/currency_converter/convert', to: 'currency_convertor#convert'
      get '/currency_converter/data', to: 'currency_convertor#data'
      post '/currency_converter/save_data', to: 'currency_convertor#save_data'
      get '/currency_converter/fetch_data', to: 'currency_convertor#fetch_data'

    end
  end  
end
