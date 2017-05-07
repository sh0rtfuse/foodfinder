#!/bin/bash

echo "Clear asset pipeline..."
rake tmp:cache:clear

echo "Installing production gems..."
bundle install --deployment --without development test

# Relative URL root is for js-routes gem. My application is not in the root of the app.
echo "Build app..."
bundle exec rake assets:precompile db:migrate RAILS_ENV=production RAILS_RELATIVE_URL_ROOT=/foodfinder

echo "Restart Passenger..."
passenger-config restart-app $(pwd)

