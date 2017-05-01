Rails.application.routes.draw do
  # get 'food_finder/index'
  resources :food_finders

  root 'food_finders#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
