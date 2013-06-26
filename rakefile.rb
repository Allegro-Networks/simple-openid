task :default => [:dependencies, :jshint, :test, :git]

multitask :dependencies => [:node_dependencies, :ruby_dependencies]

task :ruby_dependencies do
	sh 'bundle install --path gems'
end

task :node_dependencies do
	sh 'npm install'
end

task :jshint do
	sh 'jshint ./tests'
end

task :test do 
	sh 'mocha ./tests --ui qunit --colors --reporter nyan'
end

task :git => :ruby_dependencies do 
	require 'git_repository'
	message = ENV['m']
	raise 'no commit message specified' if message.nil?
	git = GitRepository.new
	git.pull
	git.add
	git.commit(message: message )
	git.push
end