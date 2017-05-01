Rails.application.routes.draw do
  # get 'food_finder/index'
  resources :food_finder

  post '/food_finder', to: 'food_finder#create'

  root 'food_finder#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
